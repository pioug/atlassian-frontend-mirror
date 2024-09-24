import { token } from '@atlaskit/tokens';

// TODO: https://product-fabric.atlassian.net/browse/DSP-4494
export const scrollbarStyles = `
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar {
    overflow: hidden,
  }

  &::-webkit-scrollbar-corner {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${token('color.background.neutral.subtle')};
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: ${token('color.background.neutral.bold')};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${token('color.background.neutral.bold.hovered')};
  }
`;
