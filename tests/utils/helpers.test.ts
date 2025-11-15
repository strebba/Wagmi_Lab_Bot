import {
  encodeCallbackData,
  decodeCallbackData,
  escapeMarkdown,
  formatDate,
} from '../../src/utils/helpers';
import { CallbackAction } from '../../src/types';

describe('Helpers', () => {
  describe('encodeCallbackData', () => {
    it('should encode callback data to JSON string', () => {
      const data = {
        action: CallbackAction.SELECT_COMMUNITY,
        communityId: 'wagmi-defi',
      };

      const encoded = encodeCallbackData(data);

      expect(typeof encoded).toBe('string');
      expect(encoded).toContain('SELECT_COMMUNITY');
      expect(encoded).toContain('wagmi-defi');
    });
  });

  describe('decodeCallbackData', () => {
    it('should decode valid JSON string to callback data', () => {
      const jsonString = JSON.stringify({
        action: CallbackAction.SELECT_COMMUNITY,
        communityId: 'wagmi-defi',
      });

      const decoded = decodeCallbackData(jsonString);

      expect(decoded.action).toBe(CallbackAction.SELECT_COMMUNITY);
      expect(decoded.communityId).toBe('wagmi-defi');
    });

    it('should return default data for invalid JSON', () => {
      const invalidJson = 'invalid{json}';

      const decoded = decodeCallbackData(invalidJson);

      expect(decoded.action).toBe(CallbackAction.BACK_TO_MENU);
    });
  });

  describe('escapeMarkdown', () => {
    it('should escape markdown special characters', () => {
      const text = 'Text with *bold* and _italic_ and [link]';
      const escaped = escapeMarkdown(text);

      expect(escaped).toContain('\\*');
      expect(escaped).toContain('\\_');
      expect(escaped).toContain('\\[');
    });
  });

  describe('formatDate', () => {
    it('should format date to Italian locale', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date);

      expect(formatted).toContain('2024');
      expect(typeof formatted).toBe('string');
    });
  });
});
