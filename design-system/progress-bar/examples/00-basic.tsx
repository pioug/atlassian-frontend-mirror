import React from 'react';

import { token } from '@atlaskit/tokens';

import ProgressBar from '../src';

export const progress = 0.4;
export const containerStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: token('space.250', '20px'),
  width: 600,
};

export default () => (
  <div style={containerStyle}>
    <ProgressBar value={progress} />
  </div>
);
