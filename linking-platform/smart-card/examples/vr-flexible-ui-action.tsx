/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { VRTestWrapper } from './utils/vr-test';
import FlexibleCardAction from './vr-flexible-card/vr-flexible-ui-action';

// Override the padding that came with new vr wrapper
const containerStyles = css`
  div.vr-test-wrapper {
    padding: 4px 0 0 0;
  }
`;

// This file should be removed once the gemini equivalent test is merged
// @see packages/linking-platform/smart-card/src/__tests__/vr-tests/flex-ui-action.vr.tsx
export default () => (
  <VRTestWrapper title="Flexible UI: Action">
    <div css={containerStyles}>
      <FlexibleCardAction />
    </div>
  </VRTestWrapper>
);
