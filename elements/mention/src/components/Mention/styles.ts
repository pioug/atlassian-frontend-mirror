import { themed } from '@atlaskit/theme/components';
import {
  B200,
  B400,
  DN100,
  DN30,
  DN80,
  DN800,
  N20,
  N30A,
  N500,
} from '@atlaskit/theme/colors';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { MentionType } from '../../types';

export interface MentionStyleProps {
  mentionType: MentionType;
}

const mentionStyle: { [key in MentionType]: any } = {
  [MentionType.SELF]: {
    background: themed({ light: B400, dark: B200 }),
    border: 'transparent',
    text: themed({ light: N20, dark: DN30 }),
  },
  [MentionType.RESTRICTED]: {
    background: 'transparent',
    border: themed({ light: N500, dark: DN80 }),
    text: themed({ light: N500, dark: DN100 }),
  },
  [MentionType.DEFAULT]: {
    background: themed({ light: N30A, dark: DN80 }),
    border: 'transparent',
    text: themed({ light: N500, dark: DN800 }),
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
