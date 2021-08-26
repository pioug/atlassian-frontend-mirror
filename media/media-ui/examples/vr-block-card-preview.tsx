/** @jsx jsx */
import { jsx } from '@emotion/core';
import { smallImage } from '@atlaskit/media-test-helpers';

import { BlockCardResolvedView } from '../src/BlockCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Block card with preview">
    {() => (
      <BlockCardResolvedView
        icon={{ url: smallImage }}
        title="Smart Links - Designs"
        link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
        byline={'Updated 2 days ago. Created 3 days ago.'}
        thumbnail={smallImage}
        context={{ text: 'Dropbox', icon: smallImage }}
        actions={[
          {
            id: '',
            text: 'Preview',
            promise: () => Promise.resolve(),
          },
        ]}
      />
    )}
  </VRTestCase>
);
