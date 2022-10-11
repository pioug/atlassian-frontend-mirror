/** @jsx jsx */
import { jsx } from '@emotion/react';
import { smallImage } from '@atlaskit/media-test-helpers';

import { InlineCardResolvedView } from '../src/view/InlineCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Inline card with default icon">
    {() => (
      <InlineCardResolvedView
        isSelected={false}
        icon={smallImage}
        title="Smart Links - Designs"
        lozenge={{
          text: 'in progress',
          appearance: 'inprogress',
          isBold: true,
        }}
      />
    )}
  </VRTestCase>
);
