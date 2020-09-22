import { akEditorFullWidthLayoutWidth } from '@atlaskit/editor-shared-styles';

import {
  calcLegacyWidth,
  calcResizedWidth,
} from '../../../ui/MediaSingle/styled';
import { calcBreakoutWidth, calcWideWidth } from '../../../utils/breakout';

describe('@atlaskit/editor-common media utils', () => {
  describe('#calcLegacyWidth and #calcResizedWidth', () => {
    const containerWidth = 1225;

    describe('when layout = "full-width"', () => {
      it('should calculate correct width for non-resized images', () => {
        const width = containerWidth;
        expect(calcLegacyWidth('full-width', width, containerWidth)).toEqual(
          calcBreakoutWidth('full-width', containerWidth),
        );
        expect(calcResizedWidth('full-width', width, containerWidth)).toEqual(
          calcBreakoutWidth('full-width', containerWidth),
        );
      });

      it(`should not exceed ${akEditorFullWidthLayoutWidth}px`, () => {
        const pageWidth = 2000;
        expect(calcBreakoutWidth('full-width', pageWidth)).toEqual(
          `${akEditorFullWidthLayoutWidth}px`,
        );
      });
    });

    describe('when layout = "wide"', () => {
      it('should calculate correct width for non-resized images', () => {
        const width = 680;
        expect(calcLegacyWidth('wide', width, containerWidth)).toEqual(
          calcWideWidth(containerWidth),
        );
        expect(calcResizedWidth('wide', width, containerWidth)).toEqual(
          calcWideWidth(containerWidth),
        );
      });
    });

    describe('when layout = "center"', () => {
      it('should calculate correct width for non-resized images', () => {
        const width = 480;
        expect(calcLegacyWidth('center', width, containerWidth)).toEqual(
          `${width}px`,
        );
        expect(calcResizedWidth('center', width, containerWidth)).toEqual(
          `${width}px`,
        );
      });
    });
  });
});
