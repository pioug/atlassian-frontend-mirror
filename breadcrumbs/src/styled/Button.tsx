import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';

interface Props extends ButtonProps {
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
