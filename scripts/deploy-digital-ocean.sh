#!/bin/bash

#
# Deployment script for Digital Ocean App Platform
# This script helps you deploy the Wagmi-Lab Bot to Digital Ocean
#

set -e

echo "🚀 Wagmi-Lab Bot - Digital Ocean Deployment Script"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}❌ doctl CLI not found!${NC}"
    echo "Please install it: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if user is authenticated
if ! doctl auth list &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Digital Ocean${NC}"
    echo "Run: doctl auth init"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}\n"

# Menu
echo "Select deployment method:"
echo "1) Deploy to App Platform (Recommended)"
echo "2) Deploy to Droplet with Docker"
echo "3) Exit"
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo -e "\n${YELLOW}📦 Deploying to App Platform...${NC}"
        echo "This will create a new app from your GitHub repository"
        echo ""
        echo "Make sure you have:"
        echo "  - Pushed your code to GitHub"
        echo "  - Set BOT_TOKEN as an environment variable in App Platform"
        echo ""
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Please create the app manually in Digital Ocean App Platform:"
            echo "1. Go to https://cloud.digitalocean.com/apps"
            echo "2. Click 'Create App'"
            echo "3. Select your GitHub repository"
            echo "4. Add BOT_TOKEN environment variable"
            echo "5. Deploy!"
        fi
        ;;

    2)
        echo -e "\n${YELLOW}🐳 Deploying to Droplet with Docker...${NC}"
        read -p "Enter Droplet IP: " droplet_ip
        read -p "Enter SSH user (default: root): " ssh_user
        ssh_user=${ssh_user:-root}

        echo -e "${GREEN}📤 Copying files to Droplet...${NC}"
        scp -r ./* ${ssh_user}@${droplet_ip}:/opt/wagmi-lab-bot/

        echo -e "${GREEN}🔧 Setting up on Droplet...${NC}"
        ssh ${ssh_user}@${droplet_ip} << 'EOF'
cd /opt/wagmi-lab-bot
docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs -f
EOF
        ;;

    3)
        echo "Exiting..."
        exit 0
        ;;

    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}✅ Deployment process completed!${NC}"
