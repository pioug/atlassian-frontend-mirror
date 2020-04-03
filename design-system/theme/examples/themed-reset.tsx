import React from 'react';
import { Reset, ResetTheme } from '../src';

export default () => (
  <ResetTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333', textColor: '#eee' })}
  >
    <Reset style={{ padding: 10 }}>You can also theme a reset.</Reset>
  </ResetTheme.Provider>
);
