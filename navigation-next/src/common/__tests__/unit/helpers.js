import { applyDisabledProperties } from '../../helpers';

describe('Common Helpers', () => {
  describe('applyDisabledProperties', () => {
    it('should remove point event and user select styles if the interaction is disabled', () => {
      expect(applyDisabledProperties(true)).toEqual({
        pointerEvents: 'none',
        userSelect: 'none',
      });
    });

    it('should NOT remove point event and user select styles if the interaction is enabled', () => {
      expect(applyDisabledProperties(false)).toEqual(null);
    });
  });
});
