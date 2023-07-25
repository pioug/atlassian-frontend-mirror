/** @jsx jsx */
import { jsx } from '@emotion/react';
import { smallImage } from '@atlaskit/media-test-helpers';
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
};
