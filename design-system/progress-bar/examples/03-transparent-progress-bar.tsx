import React from 'react';

import { TransparentProgressBar } from '../src';

import { progress } from './00-basic';

const containerStyle = {
  padding: '25px 10px',
  background: '#DFE1E5',
  borderRadius: 3,
};

export default () => (
  <div style={containerStyle}>
    <TransparentProgressBar value={progress} />
  </div>
);
