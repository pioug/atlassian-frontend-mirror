/** @jsx jsx */
import { jsx } from '@emotion/core';

import { InlineCardResolvedView } from '../src/view/InlineCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Inline card text wrap">
    {() => (
      <div style={{ maxWidth: '50px' }}>
        <InlineCardResolvedView
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
