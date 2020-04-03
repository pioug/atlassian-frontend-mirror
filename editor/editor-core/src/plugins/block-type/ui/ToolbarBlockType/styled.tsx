import { colors } from '@atlaskit/theme';
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { headingsSharedStyles } from '@atlaskit/editor-common';
import { Shortcut } from '../../../../ui/styles';

export const BlockTypeMenuItem = styled.div<{
  tagName: string;
  selected?: boolean;
}>`
  ${headingsSharedStyles};
  > {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 0;
    }
  }
  ${props => (props.selected ? `${props.tagName} { color: white }` : '')};
`;

export const KeyboardShortcut: ComponentClass<HTMLAttributes<{}> & {
  selected?: boolean;
}> = styled(Shortcut)`
  ${props => (props.selected ? `color: ${colors.N400};` : '')}
  margin-left: 16px;
`;
