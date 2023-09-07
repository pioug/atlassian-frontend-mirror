import React from 'react';

import { UNSAFE_LAYERING, UNSAFE_useLayering } from '../src';

const LayerWrapper = () => {
  const { currentLevel, topLevelRef } = UNSAFE_useLayering();

  return (
    <div>
      current Level is {currentLevel}, top level is {topLevelRef.current}
    </div>
  );
};

export default () => (
  <UNSAFE_LAYERING>
    <LayerWrapper />
  </UNSAFE_LAYERING>
);
