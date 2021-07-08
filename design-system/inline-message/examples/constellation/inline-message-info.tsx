import React from 'react';

import InlineMessage from '../../src';

const InlineMessageInfoExample = () => {
  return (
    <InlineMessage type="info" secondaryText="Learn more">
      <p>
        <strong>Want more information?</strong>
      </p>
      <p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">Log in</a> to setup your Bitbucket account.
      </p>
    </InlineMessage>
  );
};

export default InlineMessageInfoExample;
