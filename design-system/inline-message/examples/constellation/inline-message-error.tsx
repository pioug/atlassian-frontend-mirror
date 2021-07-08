import React from 'react';

import InlineMessage from '../../src';

const InlineMessageErrorExample = () => {
  return (
    <InlineMessage
      type="error"
      iconLabel="Error! This name is already in use. Try another."
    >
      <p>This name is already in use. Try another.</p>
    </InlineMessage>
  );
};

export default InlineMessageErrorExample;
