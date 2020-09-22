import { borderRadius } from '@atlaskit/media-ui';
import {
  getSelectionStyles,
  SelectionStyle,
  hideNativeBrowserTextSelectionStyles,
} from '@atlaskit/editor-shared-styles/selection';

/*
 * Used to display the blue border around a selected card without
 * shrinking the image OR growing the card size
 */
export const getSelectedBorderStyle = ({
  selected,
}: {
  selected?: boolean;
}) => `
    ${hideNativeBrowserTextSelectionStyles}

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      box-sizing: border-box;
      pointer-events: none;
      ${borderRadius}
      ${selected ? getSelectionStyles([SelectionStyle.Border]) : ''}
    }
  `;
