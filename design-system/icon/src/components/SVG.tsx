/** @jsx jsx */
import { memo } from 'react';
import { css, jsx } from '@emotion/core';
import GlobalTheme from '@atlaskit/theme/components';
import type { Theme } from '@atlaskit/theme/types';

import type { SVGProps } from '../types';
import { getBackground } from './utils';
import { getSVGStyles, getSizeStyles } from './styles';

const PrimitiveSVGIcon = memo<SVGProps>(function PrimitiveSVGIcon({
  size = 'medium',
  label,
  primaryColor,
  secondaryColor,
  testId,
  children,
}) {
  return (
    <GlobalTheme.Consumer>
      {({ mode }: Theme) => (
        <svg
          viewBox="0 0 24 24"
          css={[
            getSVGStyles({
              primaryColor,
              secondaryColor: secondaryColor || getBackground(mode),
            }),
            css`
              ${getSizeStyles({ size })}
            `,
          ]}
          data-testid={testId}
          aria-label={label}
          role="presentation"
          children={children}
        />
      )}
    </GlobalTheme.Consumer>
  );
});

export default PrimitiveSVGIcon;
