/* eslint-disable @repo/internal/fs/filename-pattern-match */
import React from 'react';

import Blanket from '../src';

const BlanketPerformance = () => {
  return <Blanket isTinted={true} shouldAllowClickThrough={true} />;
};

BlanketPerformance.story = {
  name: 'Blanket with shouldAllowClickThrough enabled',
};

export default BlanketPerformance;
