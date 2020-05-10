import React from 'react';

import ProgressBar from '../src';

import { containerStyle } from './00-basic';

export default () => (
  <div style={containerStyle}>
    <ProgressBar isIndeterminate />
  </div>
);
