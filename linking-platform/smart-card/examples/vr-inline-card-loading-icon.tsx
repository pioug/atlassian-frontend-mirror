/** @jsx jsx */
import { jsx } from '@emotion/react';

import { InlineCardResolvedView } from '../src/view/InlineCard';
import { InlineCardResolvedView as RedesignedInlineCardResolvedView } from '../src/view/RedesignedInlineCard/ResolvedView';
import { VRTestCase } from './utils/common';
import { smallImage } from '@atlaskit/media-test-helpers';
import { useState, useEffect } from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export default () => {
  const ResolvedView = getBooleanFF(
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
  )
    ? RedesignedInlineCardResolvedView
    : InlineCardResolvedView;
  return (
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
          <ResolvedView
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
};
