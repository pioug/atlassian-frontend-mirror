import React from 'react';

import { UNSAFE_LAYERING, UNSAFE_useLayering } from '../src';

const SomeLayerWrapper = () => {
  const { currentLevel, topLevelRef, checkIfTopLayer } = UNSAFE_useLayering();

  return (
    <>
      <h2>
        current Level is {currentLevel}, top level is {topLevelRef.current}
      </h2>
      {checkIfTopLayer() && <p>It is the top layer</p>}
    </>
  );
};

export default () => (
  <UNSAFE_LAYERING>
    <SomeLayerWrapper />
  </UNSAFE_LAYERING>
);
