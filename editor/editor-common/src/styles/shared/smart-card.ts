import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';

export const SmartCardSharedCssClassName = {
  INLINE_CARD_CONTAINER: 'inlineCardView-content-wrap',
  BLOCK_CARD_CONTAINER: 'blockCardView-content-wrap',
  EMBED_CARD_CONTAINER: 'embedCardView-content-wrap',
  DATASOURCE_CONTAINER: 'datasourceView-content-wrap',
  LOADER_WRAPPER: 'loader-wrapper',
};

export const smartCardSharedStyles = `
  .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
    display: block;
    margin: ${blockNodesVerticalMargin} 0 0;
    max-width: ${8 * 95}px;
  }
`;
