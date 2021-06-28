import React from 'react';
import { FlagsProvider } from '../../src';

const FlagProviderExample = () => {
  return (
    <FlagsProvider>
      <h3>I'm wrapped in a flags provider.</h3>
    </FlagsProvider>
  );
};

export default FlagProviderExample;
