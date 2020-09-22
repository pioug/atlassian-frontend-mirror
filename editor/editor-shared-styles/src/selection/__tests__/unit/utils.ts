import { SelectionStyle } from '../../types';
import { getSelectionStyles } from '../../utils';

describe('selection plugin: utils', () => {
  describe('getSelectionStyles', () => {
    const selectionStyles = [
      { name: 'border', style: SelectionStyle.Border, regex: /border\:/ },
      {
        name: 'box-shadow',
        style: SelectionStyle.BoxShadow,
        regex: /box\-shadow\:/,
      },
      {
        name: 'background',
        style: SelectionStyle.Background,
        regex: /background\-color\:/,
      },
      { name: 'blanket', style: SelectionStyle.Blanket, regex: /\:\:after/ },
    ];

    for (const selectionStyle of selectionStyles) {
      it(`gets styles for ${selectionStyle.name}`, () => {
        const css = getSelectionStyles([selectionStyle.style]);
        expect(css).toMatch(selectionStyle.regex);
      });
    }

    it('combines multiple styles', () => {
      const allStyles = selectionStyles.map(
        selectionStyle => selectionStyle.style,
      );
      const allRegex = selectionStyles.map(
        selectionStyle => selectionStyle.regex,
      );

      const css = getSelectionStyles(allStyles);

      for (const regex of allRegex) {
        expect(css).toMatch(regex);
      }
    });
  });
});
