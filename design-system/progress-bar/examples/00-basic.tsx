import React from 'react';

import ProgressBar from '../src';

export const progress = 0.4;
export const containerStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  padding: 20,
  width: 600,
};

export default () => (
  <div style={containerStyle}>
    <ProgressBar value={progress} />
  </div>
);
