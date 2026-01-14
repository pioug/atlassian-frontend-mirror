/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { token } from '@atlaskit/tokens';

export const scrollbarStyles: string = `
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
