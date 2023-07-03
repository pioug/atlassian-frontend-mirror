import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

export const SmartCardSharedCssClassName = {
  INLINE_CARD_CONTAINER: 'inlineCardView-content-wrap',
  BLOCK_CARD_CONTAINER: 'blockCardView-content-wrap',
  EMBED_CARD_CONTAINER: 'embedCardView-content-wrap',
  DATASOURCE_CONTAINER: 'datasourceView-content-wrap',
  LOADER_WRAPPER: 'loader-wrapper',
};

// TODO: Migrate away from gridSize
// Recommendation: Replace gridSize with 8
export const smartCardSharedStyles = `
  .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
    display: block;
    margin: ${blockNodesVerticalMargin} 0 0;
    max-width: ${gridSize() * 95}px;
  }
`;
