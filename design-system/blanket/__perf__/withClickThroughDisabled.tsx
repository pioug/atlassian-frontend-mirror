import React from 'react';

import Blanket from '../src';

const BlanketPerformance = () => {
  return <Blanket isTinted={true} canClickThrough={false} />;
};

BlanketPerformance.story = {
  name: 'Blanket with canClickThrough disabled',
};

export default BlanketPerformance;
