import React from 'react';

import InlineMessage from '../../src';

const InlineMessageConnectivityExample = () => {
  return (
    <InlineMessage
      appearance="connectivity"
      iconLabel="Log in to see more information"
    >
      <p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">Log in</a> to access your account information
      </p>
    </InlineMessage>
  );
};

export default InlineMessageConnectivityExample;
