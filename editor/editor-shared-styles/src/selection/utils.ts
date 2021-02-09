import {
  akEditorSelectedBgColor,
  akEditorSelectedBlanketColor,
  akEditorSelectedBlanketOpacity,
  akEditorSelectedBorder,
  akEditorSelectedBoxShadow,
} from '../consts';

import { SelectionStyle } from './types';

/**
 * Adds correct selection styling for a node
 * Pass in which selection style properties you want and it will return css string of necessary styles
 *
 * eg.
 *  .expand.ak-editor-selected-node {
 *    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
 *  }
 *
 */
export const getSelectionStyles = (
  selectionStyles: Array<SelectionStyle>,
): string =>
  selectionStyles
    .map(selectionStyle => getSelectionStyle(selectionStyle))
    .concat(hideNativeBrowserTextSelectionStyles)
    .join('\n');

export const hideNativeBrowserTextSelectionStyles = `
  ::selection,*::selection {
    background-color: transparent;
  }
  ::-moz-selection,*::-moz-selection {
    background-color: transparent;
  }
`;

const getSelectionStyle = (style: SelectionStyle): string => {
  switch (style) {
    case SelectionStyle.Border:
      return `border: ${akEditorSelectedBorder};`;
    case SelectionStyle.BoxShadow:
      return `
        box-shadow: ${akEditorSelectedBoxShadow};
        border-color: transparent;
        `;
    case SelectionStyle.Background:
      return `background-color: ${akEditorSelectedBgColor};`;
    case SelectionStyle.Blanket:
      return `
        position: relative;

        // Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
        // in Safari. Looks like it's caused by user-select: all in the emoji element
        -webkit-user-select: text;

        ::after {
          position: absolute;
          content: '';
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          opacity: ${akEditorSelectedBlanketOpacity};
          pointer-events: none;
          background-color: ${akEditorSelectedBlanketColor}
        }`;
    default:
      return '';
  }
};
