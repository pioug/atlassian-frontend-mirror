import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const akGridSize = gridSize() + 'px';

// TODO: https://product-fabric.atlassian.net/browse/DSP-4494
export const scrollbarStyles = `
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar {
    height: ${akGridSize};
    width: ${akGridSize};
  }

  &::-webkit-scrollbar-corner {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${token(
      'color.background.neutral.subtle',
      'rgba(0, 0, 0, 0)',
    )};
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: ${token(
      'color.background.neutral.bold',
      'rgba(0, 0, 0, 0.2)',
    )};
    border-radius: ${akGridSize};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${token(
      'color.background.neutral.bold.hovered',
      'rgba(0, 0, 0, 0.4)',
    )};
  }
`;
