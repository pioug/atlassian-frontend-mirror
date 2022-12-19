/** @jsx jsx */
import { jsx } from '@emotion/react';

import { InlineCardResolvedView } from '../src/view/InlineCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Inline card with default icon">
    {() => (
      <InlineCardResolvedView
        link={'some-url'}
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
