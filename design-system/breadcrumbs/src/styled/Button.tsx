import React from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { CustomThemeButtonProps } from '@atlaskit/button/types';

interface Props extends CustomThemeButtonProps {
  truncationWidth?: number;
}

export default React.forwardRef<HTMLButtonElement, Props>(
  ({ truncationWidth, ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      theme={(currentTheme, themeProps) => {
        const { buttonStyles, ...rest } = currentTheme(themeProps);
        return {
          buttonStyles: {
            ...buttonStyles,
            fontWeight: 400,
            ...(truncationWidth
              ? { maxWidth: `${truncationWidth}px !important` }
              : { flexShrink: 1, minWidth: 0 }),
          },
          ...rest,
        };
      }}
    />
  ),
);
