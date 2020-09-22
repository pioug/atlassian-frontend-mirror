import React from 'react';
import styled from 'styled-components';
import { N0, N900, N70 } from '@atlaskit/theme/colors';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';

export const ErrorPopup: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  width: 290px;
  padding: 16px;
  background-color: ${N0};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ErrorIconWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  width: 92px;
`;

export const ErrorMessage: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  color: ${N900};
  margin-top: 16px;
  margin-bottom: 4px;
  width: 256px;
  text-align: center;
  font-weight: bold;
`;

export const ErrorHint: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  color: ${N70};
  margin-top: 4px;
  margin-bottom: 20px;
  width: 256px;
  text-align: center;
`;

export const ErrorButton = (props: CustomThemeButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          display: 'inline-flex',
          width: '84px',
          margin: '2px',
          justifyContent: 'center',
        },
        ...rest,
      };
    }}
  />
);
