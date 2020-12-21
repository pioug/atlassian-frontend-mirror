import React from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { CustomThemeButtonProps } from '@atlaskit/button/types';

interface BreadcrumbsButtonProps extends CustomThemeButtonProps {
  hasOverflow?: boolean;

  /** The maximum width in pixels that an item can have before it is truncated.
   If this is not set, truncation will only occur when it cannot fit alone on a
   line. If there is no truncationWidth, tooltips are not provided on truncation. */
  truncationWidth?: number;
}

export default React.forwardRef<HTMLButtonElement, BreadcrumbsButtonProps>(
  (
    { truncationWidth, hasOverflow = true, iconBefore, iconAfter, ...props },
    ref,
  ) => {
    return (
      <Button
        appearance="subtle-link"
        spacing="none"
        iconAfter={hasOverflow ? undefined : iconAfter}
        iconBefore={hasOverflow ? undefined : iconBefore}
        ref={ref}
        {...props}
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
    );
  },
);
