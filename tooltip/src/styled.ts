import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { N800, DN0, N0, DN600 } from '@atlaskit/theme/colors';

const backgroundColor = themed({
  light: N800,
  dark: DN0,
});
const textColor = themed({
  light: N0,
  dark: DN600,
});

interface TooltipProps {
  truncate?: boolean;
}

export const TooltipPrimitive = styled.div<TooltipProps>`
  z-index: ${layers.tooltip};
  pointer-events: none;
  position: fixed;
`;

export const Tooltip = styled<TooltipProps>(TooltipPrimitive)`
  background-color: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-sizing: border-box;
  color: ${textColor};
  font-size: 12px;
  left: 0;
  line-height: 1.3;
  max-width: 240px;
  padding: 2px 6px;
  top: 0;
  /* Edge does not support overflow-wrap */
  word-wrap: break-word;
  overflow-wrap: break-word;

  ${({ truncate }) =>
    truncate &&
    `
      max-width: 420px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}
`;

// The inline-block here is needed to keep the tooltip appearing in the correct position
// when nested inside a wider parent (see position: relative example).
export const Target = styled.div`
  display: inline-block;
`;
