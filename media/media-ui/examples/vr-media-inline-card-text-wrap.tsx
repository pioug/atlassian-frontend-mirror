import React from 'react';
import { smallImage } from '@atlaskit/media-common/test-helpers';

import { MediaInlineCardLoadedView } from '../src/MediaInlineCard/LoadedView';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Media inline card with default icon">
    {() => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      <div style={{ maxWidth: '50px' }}>
        <MediaInlineCardLoadedView
          isSelected={false}
          icon={smallImage}
          title="Smart Links - Designs"
        />
      </div>
    )}
  </VRTestCase>
);
