/** @jsx jsx */
import { jsx } from '@emotion/react';
import { InlineCardResolvedView as ResolvedView } from '../src/view/InlineCard/ResolvedView';
import { VRTestCase } from './utils/common';

export default () => {
  return (
    <VRTestCase title="Inline card text wrap">
      {() => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
