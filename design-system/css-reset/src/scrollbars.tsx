import { token } from '@atlaskit/tokens';

import evaluateInner from './utils/evaluate-inner';

// The cascade layer keeps component-owned rules stronger, including interaction states.
// A 12px allocation with two 2px transparent insets paints an 8px thumb.
const scrollbarSelector =
	':where(:root[data-scrollbar-harmonisation], :root[data-scrollbar-harmonisation] *)';

const thumbColor = token('color.background.accent.gray.subtle', '#8C8F97');

// Standard properties for environments without the WebKit treatment. They are declared only
// there, so the WebKit path never sets a width on every element just to unset it again.
const standardScrollbarStyles = `
  :root[data-scrollbar-harmonisation] {
    scrollbar-color: ${thumbColor} transparent;
  }

  ${scrollbarSelector} {
    scrollbar-width: thin;
  }
`;

const scrollbarStyles: string = evaluateInner`/*
 * Feature-gated harmonised scrollbar appearance.
 * Standard colours are set only on the root and inherited. Declaring scrollbar-color with a
 * var() on every element would make every element depend on inherited custom properties.
 */
@layer atlaskit-scrollbar-harmonisation {
/* Media query lists and @supports not avoid nested not(), which Confluence's CSSO minifier drops. */
@media (hover: none), (pointer: coarse), (pointer: none), (any-pointer: coarse) {${standardScrollbarStyles}}

@supports not selector(::-webkit-scrollbar-thumb:hover) {${standardScrollbarStyles}}

@media (hover: hover) and (pointer: fine) and (forced-colors: none) {
  @media not all and (any-pointer: coarse) {
    @supports selector(::-webkit-scrollbar-thumb:hover) {
      ${scrollbarSelector}::-webkit-scrollbar {
        width: 12px;
        height: 12px;
        background-color: transparent;
      }

      ${scrollbarSelector}::-webkit-scrollbar-track,
      ${scrollbarSelector}::-webkit-scrollbar-corner {
        background-color: transparent;
        border: 0;
      }

      ${scrollbarSelector}::-webkit-scrollbar-thumb {
        background-color: ${thumbColor};
        background-clip: padding-box;
        border: 2px solid transparent;
        border-radius: ${token('radius.full', '9999px')};
      }

      ${scrollbarSelector}::-webkit-scrollbar-thumb:hover,
      ${scrollbarSelector}::-webkit-scrollbar-thumb:active {
        background-color: ${token('color.background.accent.gray.bolder', '#6B6E76')};
      }
    }
  }
}

@media (forced-colors: active) {
  :root[data-scrollbar-harmonisation] {
    scrollbar-color: auto;
  }

  ${scrollbarSelector} {
    scrollbar-width: auto;
  }
}
}`;

export default scrollbarStyles;
