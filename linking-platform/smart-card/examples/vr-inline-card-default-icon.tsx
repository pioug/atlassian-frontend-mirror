/** @jsx jsx */
import { jsx } from '@emotion/react';

import { InlineCardResolvedView } from '../src/view/InlineCard';
import { InlineCardResolvedView as RedesignedInlineCardResolvedView } from '../src/view/RedesignedInlineCard/ResolvedView';
import { VRTestCase } from './utils/common';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export default () => {
  const ResolvedView = getBooleanFF(
    'platform.linking-platform.smart-card.show-inline-card-refreshed-design',
  )
    ? RedesignedInlineCardResolvedView
    : InlineCardResolvedView;
  return (
    <VRTestCase title="Inline card with default icon">
      {() => (
        <ResolvedView
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
};
