import { N400 } from '@atlaskit/theme/colors';
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
  ${(props) =>
    // TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
    props.selected ? `${props.tagName} { color: white !important; }` : ''};
`;

export const KeyboardShortcut: ComponentClass<
  HTMLAttributes<{}> & {
    selected?: boolean;
  }
> = styled(Shortcut)`
  ${(props) => (props.selected ? `color: ${N400};` : '')}
  margin-left: 16px;
`;
