import React from 'react';
import InlineMessage from '@atlaskit/inline-message';

const DevelopmentUseMessage: React.FC = () => (
  <div style={{ textAlign: 'center' }}>
    <InlineMessage type={'warning'} title={'Development use only'}>
      The purpose of this example is to explore on edge cases for this
      component's feature. Some ways of using the component in here might not be
      the standard way. It is discouraged to use this code as a base for
      consumers.
    </InlineMessage>
  </div>
);
export default DevelopmentUseMessage;
