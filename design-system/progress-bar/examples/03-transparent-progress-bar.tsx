import React from 'react';

import { token } from '@atlaskit/tokens';

import { TransparentProgressBar } from '../src';

import { progress } from './00-basic';

const containerStyle = {
  padding: '25px 10px',
  background: token('color.background.brand.bold', '#DFE1E5'),
  borderRadius: 3,
};

export default () => (
  <div style={containerStyle}>
    <TransparentProgressBar value={progress} />
  </div>
);
