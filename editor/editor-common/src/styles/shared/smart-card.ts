import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
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
`;
