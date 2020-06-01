import { gridSize } from '@atlaskit/theme';
import { blockNodesVerticalMargin } from '../consts';

export const smartCardSharedStyles = `
  .blockCardView-content-wrap {
    display: block;
    margin: ${blockNodesVerticalMargin} 0 0;
    max-width: ${gridSize() * 95}px;
  }
`;
