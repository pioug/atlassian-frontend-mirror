import React from 'react';
import { smallImage } from '@atlaskit/media-test-helpers';

import { MediaInlineCardLoadedView } from '../src/MediaInlineCard/LoadedView';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Media inline card with default icon">
    {() => (
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
