import React from 'react';

import { useGlobalTheme } from '../src';

export default () => {
  const tokens = useGlobalTheme();
  return (
    <div>
      The default mode is <code>{tokens.mode}</code>.
    </div>
  );
};
