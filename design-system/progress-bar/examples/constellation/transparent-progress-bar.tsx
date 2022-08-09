import React from 'react';

import { TransparentProgressBar } from '../../src';

const TransparentProgressBarExample = () => {
  return (
    <TransparentProgressBar ariaLabel="Done: 4 of 10 issues" value={0.4} />
  );
};

export default TransparentProgressBarExample;
