/** @jsx jsx */
import { css } from '@emotion/react';

import { N400 } from '@atlaskit/theme/colors';
import { ThemeProps } from '@atlaskit/theme/types';
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { Shortcut } from '../../../../ui/styles';

export const blockTypeMenuItemStyle = (tagName: string, selected?: boolean) => {
  // TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
  const selectedStyle = selected
    ? `${tagName} { color: white !important; }`
    : '';

  return (themeProps: ThemeProps) => css`
    ${headingsSharedStyles(themeProps)};
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
    ${selectedStyle};
  `;
};

export const KeyboardShortcut: ComponentClass<
  HTMLAttributes<{}> & {
    selected?: boolean;
  }
> = styled(Shortcut)`
  ${(props) => (props.selected ? `color: ${N400};` : '')}
  margin-left: 16px;
`;
