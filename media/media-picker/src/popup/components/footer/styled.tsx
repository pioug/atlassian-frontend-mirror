import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@atlaskit/button';

export const Wrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;

  height: 80px;
  padding: 26px 15px 23px 18px;
`;

export const InsertButton = (props: ButtonProps) => (
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

export const CancelButton = (props: ButtonProps) => <Button {...props} />;
