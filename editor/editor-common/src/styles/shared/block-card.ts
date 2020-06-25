import { gridSize } from '@atlaskit/theme';
import {
  blockNodesVerticalMargin,
  akEditorDeleteBorder,
  akEditorDeleteBackground,
} from '../consts';

export const smartCardSharedStyles = `
  .blockCardView-content-wrap {
    display: block;
    margin: ${blockNodesVerticalMargin} 0 0;
    max-width: ${gridSize() * 95}px;
  }

  .embedCardView-content-wrap {
    &.danger .media-card-frame::after{
      box-shadow: 0 0 0 3px ${akEditorDeleteBorder} !important;
      background: ${akEditorDeleteBackground} !important;
    }
  }
`;
