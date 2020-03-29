import React from 'react';
import * as colors from '@atlaskit/theme/colors';
import Spinner from '../../src';

const SpinnerExample = () => (
  <div>
    <span
      style={{
        padding: '7px',
        backgroundColor: colors.DN30,
        display: 'inline-block',
      }}
    >
      <Spinner invertColor />
    </span>
  </div>
);

export default SpinnerExample;
