import { themed } from '@atlaskit/theme/components';
import * as colors from '@atlaskit/theme/colors';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { MentionType } from '../../types';

export interface MentionStyleProps {
  mentionType: MentionType;
}

const mentionStyle: { [key in MentionType]: any } = {
  [MentionType.SELF]: {
    background: themed({ light: colors.B400, dark: colors.B200 }),
    border: 'transparent',
    text: themed({ light: colors.N20, dark: colors.DN30 }),
  },
  [MentionType.RESTRICTED]: {
    background: 'transparent',
    border: themed({ light: colors.N500, dark: colors.DN80 }),
    text: themed({ light: colors.N500, dark: colors.DN100 }),
  },
  [MentionType.DEFAULT]: {
    background: themed({ light: colors.N30A, dark: colors.DN80 }),
    border: 'transparent',
    text: themed({ light: colors.N500, dark: colors.DN800 }),
  },
};

const getStyle = (
  props: MentionStyleProps,
  property: 'background' | 'border' | 'text',
) => {
  const obj = mentionStyle[props.mentionType][property];
  // themed() returns a function
  return typeof obj === 'string' ? obj : obj(props);
};

export const MentionStyle: ComponentClass<
  HTMLAttributes<{}> & MentionStyleProps
> = styled.span`
  ${(props: MentionStyleProps) => `
  display: inline;
  background: ${getStyle(props, 'background')};
  border: 1px solid ${getStyle(props, 'border')};
  border-radius: 20px;
  color: ${getStyle(props, 'text')};
  cursor: pointer;
  padding: 0 0.3em 2px 0.23em;
  line-height: 1.714;
  font-size: 1em;
  font-weight: normal;
  word-break: break-word;
`};
`;
