import React from 'react';

import InlineMessage from '../../src';

const InlineMessageInfoExample = () => {
  return (
    <InlineMessage appearance="info">
      <p>
        <strong>Test drive your new search</strong>
      </p>
      <p>
        We've turbocharged your search results so you can get back to doing what
        you do best.
      </p>
      <p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">Learn more</a>
      </p>
    </InlineMessage>
  );
};

export default InlineMessageInfoExample;
