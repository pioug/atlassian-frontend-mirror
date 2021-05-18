import React, { ReactElement, SyntheticEvent } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { gridSize } from '@atlaskit/theme/constants';

export type NavigatorPropsType<T> = {
  /** This will be passed in as aria-label to button. This is what screen reader will read */
  'aria-label'?: string;
  /** Is the navigator disabled */
  isDisabled?: boolean;
  iconBefore: ReactElement;
  pages: T[];
  /** This function is called with the when user clicks on navigator */
  onClick?: (event: SyntheticEvent) => void;
  component?: React.ElementType<any>;
};

export default function Navigator<T>(props: NavigatorPropsType<T>) {
  return (
    <Button
      {...props}
      appearance="subtle"
      spacing="none"
      theme={(currentTheme, themeProps) => {
        const { buttonStyles, ...rest } = currentTheme(themeProps);
        const halfGridSize = gridSize() / 2;
        return {
          buttonStyles: {
            ...buttonStyles,
            paddingLeft: `${halfGridSize}px`,
            paddingRight: `${halfGridSize}px`,
            'html[dir=rtl] &': {
              transform: 'rotate(180deg)',
            },
          },
          ...rest,
        };
      }}
    />
  );
}
