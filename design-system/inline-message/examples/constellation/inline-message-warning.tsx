import React from 'react';

import InlineMessage from '../../src';

const InlineMessageWarningExample = () => {
  return (
    <InlineMessage type="warning" secondaryText="Your bill may increase">
      <p>
        <strong>Adding new users</strong>
      </p>
      <p>
        You are adding 5 new users to your selected product, if they don’t
        already have access to this product your bill may increase.
      </p>
    </InlineMessage>
  );
};

export default InlineMessageWarningExample;
