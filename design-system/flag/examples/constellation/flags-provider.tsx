import React from 'react';
import { FlagsProvider } from '../../src';

export default () => (
  <FlagsProvider>
    <h3>I'm wrapped in a flags provider.</h3>
  </FlagsProvider>
);
