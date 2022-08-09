import React from 'react';

import ProgressBar from '../../src';

const ProgressBarInverseExample = () => {
  return (
    <ProgressBar
      appearance="inverse"
      ariaLabel="Done: 6 of 10 issues"
      value={0.6}
    />
  );
};

export default ProgressBarInverseExample;
