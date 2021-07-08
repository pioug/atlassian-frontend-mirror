import React from 'react';

import InlineMessage from '../../src';

const InlineMessageConnectivityExample = () => {
  return (
    <InlineMessage
      type="connectivity"
      iconLabel="Log in to see more information"
    >
      <p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">Log in</a> to see more information
      </p>
    </InlineMessage>
  );
};

export default InlineMessageConnectivityExample;
