import React from 'react';

import { render } from '@testing-library/react';

import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import { cssVar } from '../../../constants';
import * as theme from '../../../theme';
import BaseTag from '../../internal/shared/base';
import getCSSVar from '../_utils/get-css-var';

describe('<BaseTag />', () => {
  describe('border radius', () => {
    it('should be determined by the css variable', () => {
      const { getByTestId } = render(
        <BaseTag contentElement={<span>Hello world</span>} testId="tag" />,
      );

      const tag = getByTestId('tag');
      expect(tag).toHaveStyleDeclaration(
        'border-radius',
        `var(${cssVar.borderRadius})`,
      );
    });

    it('should use the default border radius', () => {
      const { getByTestId } = render(
        <BaseTag contentElement={<span>Hello world</span>} testId="tag" />,
      );

      const tag = getByTestId('tag');
      const styles = getComputedStyle(tag);
      expect(styles.getPropertyValue(cssVar.borderRadius)).toBe(
        theme.borderRadius.default,
      );
    });

    it('should be configurable using appearance', () => {
      const { getByTestId } = render(
        <BaseTag
          contentElement={<span>Hello world</span>}
          appearance="rounded"
          testId="tag"
        />,
      );

      const tag = getByTestId('tag');
      const styles = getComputedStyle(tag);
      expect(styles.getPropertyValue(cssVar.borderRadius)).toBe(
        theme.borderRadius.rounded,
      );
    });
  });

  describe('tag color', () => {
    const tagColors = [['standard'], ['blueLight']] as const;

    it('should be determined by css variables', () => {
      const { getByTestId } = render(
        <BaseTag contentElement={<span>Hello world</span>} testId="tag" />,
      );
      const tag = getByTestId('tag');

      expect(tag).toHaveStyleDeclaration(
        'background-color',
        `var(${cssVar.color.background.default})`,
      );

      expect(tag).toHaveStyleDeclaration(
        'color',
        `var(${cssVar.color.text.default})`,
      );
    });

    it.each(tagColors)(
      'should be configured by the color prop (color="%s")',
      (tagColor) => {
        const { getByTestId } = render(
          <BaseTag
            color={tagColor}
            contentElement={<span>Hello world</span>}
            testId="tag"
          />,
        );
        const tag = getByTestId('tag');

        expect(getCSSVar(tag, cssVar.color.background.default)).toBe(
          theme.backgroundColors[tagColor].light,
        );

        expect(getCSSVar(tag, cssVar.color.text.default)).toBe(
          theme.textColors[tagColor].light,
        );
      },
    );

    it.each(tagColors)('should support legacy theming (%s)', (tagColor) => {
      const { getByTestId } = render(
        <AtlaskitThemeProvider mode="dark">
          <BaseTag
            color={tagColor}
            contentElement={<span>Hello world</span>}
            testId="tag"
          />
        </AtlaskitThemeProvider>,
      );
      const tag = getByTestId('tag');

      expect(getCSSVar(tag, cssVar.color.background.default)).toBe(
        theme.backgroundColors[tagColor].dark,
      );

      expect(getCSSVar(tag, cssVar.color.text.default)).toBe(
        theme.textColors[tagColor].dark,
      );
    });
  });
});
