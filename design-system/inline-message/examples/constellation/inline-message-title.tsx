import React from 'react';

import InlineMessage from '../../src';

const InlineMessageTitleExample = () => {
  return (
    <InlineMessage title="This page may be out of date">
      <p>
        This page was last updated 65 days ago. See the version history for more
        details.
      </p>
    </InlineMessage>
  );
};

export default InlineMessageTitleExample;
