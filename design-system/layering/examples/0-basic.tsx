import React from 'react';

import { UNSAFE_LAYERING, UNSAFE_useLayering } from '../src';

const SomeLayerWrapper = () => {
  const { currentLevel, topLevelRef, isLayerDisabled } = UNSAFE_useLayering();

  return (
    <>
      <h2>
        current Level is {currentLevel}, top level is{' '}
        {topLevelRef.current ?? 'disabled'}
      </h2>
      {isLayerDisabled() ? (
        <p>It is a disabled layer</p>
      ) : (
        <p>It is the top layer</p>
      )}
    </>
  );
};

export default () => (
  <UNSAFE_LAYERING isDisabled={false}>
    <SomeLayerWrapper />
  </UNSAFE_LAYERING>
);
