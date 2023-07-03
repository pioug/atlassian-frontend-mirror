import { css } from '@emotion/react';
import { N20, N40, B400, B50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const filmStripViewStyles = css`
  position: relative;
  padding: 3px 0;
  border-radius: 3px;

  &:hover .arrow {
    opacity: 1;
  }

  .ellipsed-text {
    white-space: initial;
  }
`;

export const filmStripListWrapperStyles = css`
  width: inherit;
  overflow: hidden;
  padding: ${token('space.025', '2px')} 0;
`;

export const filmStripListStyles = css`
  margin: 0;
  padding: 0;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  white-space: nowrap;
  display: inline-block;
`;

export const filmStripListItemStyles = css`
  list-style-type: none;
  margin: 0;
  padding: 0 ${token('space.050', '4px')};
  display: inline-block;
  vertical-align: middle;
  /* Fixes issue with child Cards using inline-block */
  font-size: 0;
`;

export const arrowWrapperStyles = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${token('elevation.surface.overlay', N20)};
  border-radius: 100%;
  display: flex;
  cursor: pointer;
  transition: opacity 0.3s;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    '0 1px 6px 0 rgba(0, 0, 0, 0.6)',
  )};
  color: ${token('color.icon', 'black')};
  width: 30px;
  height: 30px;
  justify-content: center;
  opacity: 0;

  &:hover {
    color: ${token('color.text.subtle', 'black')};
    background-color: ${token('elevation.surface.overlay.hovered', N40)};
  }

  &:active {
    color: ${token('color.text.selected', B400)};
    background-color: ${token('color.background.selected', B50)};
  }

  svg {
    height: 30px;
    width: 20px;
  }
`;

export const arrowLeftWrapperStyles = css`
  ${arrowWrapperStyles};
  left: ${token('space.100', '8px')};
  svg {
    padding-right: ${token('space.025', '2px')};
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const arrowRightWrapperStyles = css`
  ${arrowWrapperStyles};
  right: ${token('space.100', '8px')};
  svg {
    padding-left: 1px;
  }
`;

export const shadowStyles = css`
  position: absolute;
  z-index: 10;
  height: 100%;
  top: 0;
  width: 2px;
  background-color: ${token('color.border', 'rgba(0, 0, 0, 0.2)')};
`;

export const shadowLeftStyles = css`
  ${shadowStyles};
  left: 0;
`;

export const shadowRightStyles = css`
  ${shadowStyles};
  right: 0;
`;
