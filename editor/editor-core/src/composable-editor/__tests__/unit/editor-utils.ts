import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';

import { getBaseFontSize } from '../../utils/getBaseFontSize';

describe('editor utils tests', () => {
  describe('getBaseFontSize', () => {
    it('should be default size when undefined', () => {
      expect(getBaseFontSize(undefined)).toBe(akEditorFullPageDefaultFontSize);
    });

    it('should be default size when full-page', () => {
      expect(getBaseFontSize('full-page')).toBe(
        akEditorFullPageDefaultFontSize,
      );
    });

    it('should be undefined size when comment', () => {
      expect(getBaseFontSize('comment')).toBe(undefined);
    });
  });
});
