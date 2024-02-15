import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { N200, N40, N50A, N60A } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize, layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const AutocompleteContainer = styled.div<{
  isOpen: boolean;
}>`
  position: absolute;
  background-color: ${token('elevation.surface.overlay', 'white')};
  border-radius: ${token('border.radius.100', '3px')};
  will-change: top, left;
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  z-index: ${layers.dialog};
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  )};
  padding: ${token('space.075', '6px')} 0;
  min-width: ${25 * gridSize()}px;
  max-width: ${50 * gridSize()}px;

  &:focus {
    outline: none;
  }
`;

export const AutocompleteOptionsContainer = styled.div`
  max-height: ${36 * gridSize()}px;
  overflow: auto;
`;

export const OptionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const AutocompleteLoadingFooter = styled.div<{ hasOptions: boolean }>`
  display: flex;
  justify-content: center;
  color: ${token('color.text.subtlest', N200)};
  font-style: italic;
  padding: ${token('space.150', '12px')};
  text-align: center;
  ${props =>
    props.hasOptions
      ? // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        css`
          border-top: solid 1px ${token('color.border', N40)};
          margin-top: ${token('space.075', '6px')};
          /* 3/2 + 3/4 */
          padding-top: ${(9 / 4) * gridSize()}px;
        `
      : ''};
`;
