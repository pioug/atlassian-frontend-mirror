import React from 'react';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';

export const MAX_PICKER_HEIGHT = 102;

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
