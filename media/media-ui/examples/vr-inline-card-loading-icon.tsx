/** @jsx jsx */
import { jsx } from '@emotion/core';

import { InlineCardResolvedView } from '../src/InlineCard';
import { VRTestCase } from './utils/common';
import { smallImage } from '@atlaskit/media-test-helpers';
import { useState, useEffect } from 'react';

export default () => (
  <VRTestCase title="Inline card with default icon">
    {() => {
      // https://example.com:81/ - is a url that loads for long time. Returns timeout eventually.
      // Following is a trick that allows VR test to "load" the page.
      // If link above placed to icon right away test will never be able to "goto" this page
      // because some of the resources (this image) hasn't finished loading.
      const [icon, setIcon] = useState(smallImage);
      useEffect(() => {
        setTimeout(() => setIcon('https://example.com:81/'), 100);
      });
      return (
        <InlineCardResolvedView
          isSelected={false}
          icon={icon}
          title="Smart Links - Designs"
          lozenge={{
            text: 'in progress',
            appearance: 'inprogress',
          }}
        />
      );
    }}
  </VRTestCase>
);
