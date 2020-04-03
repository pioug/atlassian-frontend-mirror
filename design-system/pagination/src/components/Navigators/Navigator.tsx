import React, { FC, SyntheticEvent } from 'react';
import Button, { ButtonProps } from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme/constants';

export type NavigatorPropsType = {
  /** This will be passed in as aria-label to button. This is what screen reader will read */
  'aria-label'?: string;
  /** React node to render in the button, pass the text you want use to view on pagination button */
  children?: any;
  /** Is the navigator disabled */
  isDisabled?: boolean;
  /** This function is called with the when user clicks on navigator */
  onClick?: (event: SyntheticEvent) => void;
  /** Add the padding styles to the navigator
   * This can we used to add padding when displaying a icon
   */
  styles?: Object;
  component?: React.ElementType<any>;
};

const Navigator: FC<ButtonProps> = props => (
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

export default Navigator;
