import React from 'react';
import styled from 'styled-components';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';

export const Wrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;

  height: 80px;
  padding: 26px 15px 23px 18px;
`;

export const InsertButton = (props: CustomThemeButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          marginRight: '5px',
        },
        ...rest,
      };
    }}
  />
);

export const CancelButton = (props: CustomThemeButtonProps) => (
  <Button {...props} />
);
