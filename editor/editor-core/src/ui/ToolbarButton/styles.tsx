import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';

export default (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          lineHeight: 0,
          justifyContent: 'center',
          '> span': {
            margin: `0 ${props.spacing === 'none' ? '0' : '-2px'}`,
          },
          '& + &': {
            marginLeft: `${props.spacing === 'none' ? '4px' : '0px'}`,
          },
          '&[disabled]': {
            pointerEvents: 'none',
          },
        },
        ...rest,
      };
    }}
  />
);
