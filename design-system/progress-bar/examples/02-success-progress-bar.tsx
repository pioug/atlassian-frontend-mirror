import React from 'react';

import { SuccessProgressBar } from '../src';

import { containerStyle } from './00-basic';

export default () => (
  <div style={containerStyle}>
    <SuccessProgressBar value={1} ariaLabel="Done: 10 of 10 issues" />
  </div>
);
