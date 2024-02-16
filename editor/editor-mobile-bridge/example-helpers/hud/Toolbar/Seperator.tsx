import React from 'react';
import { token } from '@atlaskit/tokens';

const Seperator = () => {
  return (
    <div
      style={{
        height: '80%',
        marginLeft: token('space.050', '4px'),
        marginRight: token('space.050', '4px'),
        marginTop: 'auto',
        marginBottom: 'auto',
        width: 1,
        borderLeft: `1px solid gray`,
      }}
    ></div>
  );
};

export default Seperator;
