import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import * as colors from '../colors';
import { createTheme, ThemeProp } from '../utils/createTheme';

export type ResetThemeProps = { children?: ReactNode } | undefined;
export interface ResetThemeTokens {
  backgroundColor: string;
  textColor: string;
  linkColor?: string;
  linkColorHover?: string;
  linkColorActive?: string;
  linkColorOutline?: string;
  headingColor?: string;
  subtleHeadingColor?: string;
  subtleTextColor?: string;
}

const orTextColor = (preferred: keyof ResetThemeTokens) => (
  p: ResetThemeTokens,
) => p[preferred] || p.textColor;
const Div = styled.div`
  ${(p: ResetThemeTokens) => css`
    background-color: ${p.backgroundColor};
    color: ${p.textColor};

    a {
      color: ${orTextColor('linkColor')};
    }
    a:hover {
      color: ${orTextColor('linkColorHover')};
    }
    a:active {
      color: ${orTextColor('linkColorActive')};
    }
    a:focus {
      outline-color: ${orTextColor('linkColorOutline')};
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
      color: ${orTextColor('headingColor')};
    }
    h6 {
      color: ${orTextColor('subtleHeadingColor')};
    }
    small {
      color: ${orTextColor('subtleTextColor')};
    }
  `};
`;

export const ResetTheme = createTheme<ResetThemeTokens, ResetThemeProps>(
  () => ({
    backgroundColor: colors.N0,
    linkColor: colors.B400,
    linkColorHover: colors.B300,
    linkColorActive: colors.B500,
    linkColorOutline: colors.B100,
    headingColor: colors.N800,
    subtleHeadingColor: colors.N200,
    subtleTextColor: colors.N200,
    textColor: colors.N900,
  }),
);

interface ResetProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  theme?: ThemeProp<ResetThemeTokens, ResetThemeProps>;
}

export function Reset(props: ResetProps) {
  return (
    <ResetTheme.Provider value={props.theme}>
      <ResetTheme.Consumer>
        {(tokens: ResetThemeTokens) => {
          return (
            <Div {...{ ...tokens, mode: undefined }} {...props}>
              {props.children}
            </Div>
          );
        }}
      </ResetTheme.Consumer>
    </ResetTheme.Provider>
  );
}
