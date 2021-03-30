/** @jsx jsx */
import { memo } from 'react';
import { css, jsx } from '@emotion/core';
import GlobalTheme from '@atlaskit/theme/components';
import type { Theme } from '@atlaskit/theme/types';

import type { IconProps } from '../types';
import { getBackground } from './utils';
import { getSVGStyles, getSizeStyles } from './styles';

/**
 * We are hiding these props from consumers because they don't act as one would expect.
 */
interface InternalIconProps extends IconProps {
  /**
   * @internal NOT FOR PUBLIC USE.
   * Fixes the width of the icon.
   * This is used only for the custom sized icons in `@atlaskit/icon-file-type`.
   */
  width?: number;

  /**
   * @internal NOT FOR PUBLIC USE.
   * Fixes the height of the icon.
   * This is used only for the custom sized icons in `@atlaskit/icon-file-type`.
   */
  height?: number;
}

const Icon = memo(function Icon(props: IconProps) {
  const {
    glyph: Glyph,
    dangerouslySetGlyph,
    primaryColor,
    secondaryColor,
    size,
    testId,
    label,
    width,
    height,
  } = props as InternalIconProps;

  const glyphProps = dangerouslySetGlyph
    ? {
        dangerouslySetInnerHTML: {
          __html: dangerouslySetGlyph,
        },
      }
    : { children: Glyph ? <Glyph role="presentation" /> : null };
  const dimensions = getSizeStyles({ width, height, size });

  return (
    <GlobalTheme.Consumer>
      {({ mode }: Theme) => (
        <span
          data-testid={testId}
          role={label ? 'img' : 'presentation'}
          aria-label={label ? label : undefined}
          {...glyphProps}
          /**
           * The size dimensions on the span element have dubious value and can be removed
           * when/if icon is overhauled futher. Lite Mode didn't have the capacity to deal
           * with fully investigating the impact of this change,
           * but in _most_ cases they are not required.
           *
           * @see getSizeStyles for more info
           */
          css={css`
            display: inline-block;
            ${dimensions}
            flex-shrink: 0;
            line-height: 1;

            > svg {
              ${dimensions}
              max-height: 100%;
              max-width: 100%;
              vertical-align: bottom;
              ${getSVGStyles({
                primaryColor,
                secondaryColor: secondaryColor || getBackground(mode),
              })}
            }
          `}
        />
      )}
    </GlobalTheme.Consumer>
  );
});

export default Icon;
