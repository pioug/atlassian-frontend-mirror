import React from 'react';

import InlineMessage from '../../src';

const InlineMessagePlacementExample = () => {
  return (
    <InlineMessage
      placement="right"
      title="Title"
      secondaryText="Secondary text"
    >
      <p>Dialog to the right</p>
    </InlineMessage>
  );
};

export default InlineMessagePlacementExample;
