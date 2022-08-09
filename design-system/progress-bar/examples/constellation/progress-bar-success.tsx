import React from 'react';

import ProgressBar from '../../src';

const ProgressBarSuccessExample = () => {
  return (
    <ProgressBar
      appearance="success"
      ariaLabel="Done: 10 of 10 issues"
      value={1}
    />
  );
};

export default ProgressBarSuccessExample;
