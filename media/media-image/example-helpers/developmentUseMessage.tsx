/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import InlineMessage from '@atlaskit/inline-message';

const DevelopmentUseMessage: React.FC = () => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
  <div style={{ textAlign: 'center' }}>
    <InlineMessage appearance="warning" title="Development use only">
      The purpose of this example is to explore edge cases for this component's
      feature. Some ways of using the component in here might not be the
      standard way. It is discouraged to use this code as a base for consumers.
    </InlineMessage>
  </div>
);
export default DevelopmentUseMessage;
