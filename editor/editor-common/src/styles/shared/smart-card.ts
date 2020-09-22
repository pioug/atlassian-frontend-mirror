import {
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { gridSize } from '@atlaskit/theme/constants';

export const SmartCardSharedCssClassName = {
  INLINE_CARD_CONTAINER: 'inlineCardView-content-wrap',
  BLOCK_CARD_CONTAINER: 'blockCardView-content-wrap',
  EMBED_CARD_CONTAINER: 'embedCardView-content-wrap',
  LOADER_WRAPPER: 'loader-wrapper',
};

export const smartCardSharedStyles = `
  .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
    display: block;
    margin: ${blockNodesVerticalMargin} 0 0;
    max-width: ${gridSize() * 95}px;
  }

  .${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER} {
    &.danger .media-card-frame::after{
      box-shadow: 0 0 0 3px ${akEditorDeleteBorder} !important;
      background: ${akEditorDeleteBackground} !important;
    }
  }
`;
