import React from 'react';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize } from '@atlaskit/theme/constants';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';

import styled from 'styled-components';

export const MAX_PICKER_HEIGHT = 102;

/**
 * Apply the same styling, as previous @atlaskit/inline-dialog had,
 * compared to the @atlaskit/popup we are now using.
 *
 * packages/design-system/inline-dialog/src/InlineDialog/styled.ts:20:3
 */
export const InlineDialogContentWrapper = styled.div`
  padding: ${gridSize() * 2}px ${gridSize() * 3}px;
`;

const StyledButton: React.StatelessComponent<CustomThemeButtonProps> = React.forwardRef<
  HTMLElement,
  CustomThemeButtonProps
>((props, ref) => (
  <Button
    ref={ref}
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          padding: 0,
          '& > span > span:first-of-type': {
            margin: '0', // This is a workaround for an issue in AtlasKit (https://ecosystem.atlassian.net/browse/AK-3976)
          },
        },
        ...rest,
      };
    }}
  />
));

export default StyledButton;
