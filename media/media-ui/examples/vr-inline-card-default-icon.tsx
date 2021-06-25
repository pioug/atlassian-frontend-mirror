/** @jsx jsx */
import { jsx } from '@emotion/core';

import { InlineCardResolvedView } from '../src/InlineCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Inline card with default icon">
    {() => (
      <InlineCardResolvedView
        isSelected={false}
        icon={'broken-url'}
        title="Smart Links - Designs"
        lozenge={{
          text: 'in progress',
          appearance: 'inprogress',
        }}
      />
    )}
  </VRTestCase>
);
