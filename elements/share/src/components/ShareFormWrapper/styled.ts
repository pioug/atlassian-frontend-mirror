import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';

export const InlineDialogFormWrapper = styled.div`
  width: ${gridSize() * 44}px;
`;

/**
 * Apply the same styling, as previous @atlaskit/inline-dialog had,
 * compared to the @atlaskit/popup we are now using.
 *
 * packages/design-system/inline-dialog/src/InlineDialog/styled.ts:20:3
 */
export const InlineDialogContentWrapper = styled.div`
  padding: ${gridSize() * 2}px ${gridSize() * 3}px;
`;
