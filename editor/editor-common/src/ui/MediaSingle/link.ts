import styled from 'styled-components';

import { N0, N30, N40, N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { akEditorSwoopCubicBezier } from '../../styles/consts';

export const MediaLinkWrapper = styled.span`
  position: absolute;
  top: ${gridSize}px;
  right: ${gridSize}px;
  z-index: 1;
`;

export const MediaLink = styled.a`
  display: flex;
  background: ${N30};
  color: ${N500};
  padding: ${gridSize() / 2}px;
  border-radius: ${gridSize() / 2}px;
  border: 2px solid ${N0};
  transition: opacity 0.3s ${akEditorSwoopCubicBezier};

  &&& {
    /*
      fixes button in table cells
      https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
    */
    box-sizing: initial;
  }

  &:hover {
    background-color: ${N40};
  }
`;

MediaLinkWrapper.displayName = 'MediaLinkWrapper';
MediaLink.displayName = 'MediaLink';
