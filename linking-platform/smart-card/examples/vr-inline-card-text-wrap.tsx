/** @jsx jsx */
import { jsx } from '@emotion/react';
import { InlineCardResolvedView } from '../src/view/InlineCard';
import { InlineCardResolvedView as RedesignedInlineCardResolvedView } from '../src/view/RedesignedInlineCard/ResolvedView';
import { VRTestCase } from './utils/common';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export default () => {
  const ResolvedView = getBooleanFF(
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
  )
    ? RedesignedInlineCardResolvedView
    : InlineCardResolvedView;
  return (
    <VRTestCase title="Inline card text wrap">
      {() => (
        <div style={{ maxWidth: '50px' }}>
          <ResolvedView
            isSelected={false}
            icon={'broken-url'}
            title="hyphens - CSS: Cascading Style Sheets | MDN"
            lozenge={{
              text: 'in progress',
              appearance: 'inprogress',
            }}
          />
        </div>
      )}
    </VRTestCase>
  );
};
