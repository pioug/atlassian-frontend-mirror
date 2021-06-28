import React from 'react';

import InlineMessage from '../../src';

const InlineMessageConfirmation = () => {
  return (
    <InlineMessage type="confirmation" secondaryText="Files have been added">
      <p>You have successfully uploaded 3 files.</p>
      <p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">View files</a>
      </p>
    </InlineMessage>
  );
};

export default InlineMessageConfirmation;
