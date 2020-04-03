import React from 'react';
import * as colors from '@atlaskit/theme/colors';
import Spinner from '../src';

const SpinnerExample = () => (
  <div>
    <Spinner size="xlarge" testId="my-spinner-xlarge" />
    <Spinner size="large" testId="my-spinner-large" />
    <Spinner size="medium" testId="my-spinner-medium" />
    <Spinner size="small" testId="my-spinner-small" />
    <Spinner size="xsmall" testId="my-spinner-xsmall" />
    <span
      style={{
        padding: '7px',
        backgroundColor: colors.DN30,
        display: 'inline-block',
      }}
    >
      <Spinner invertColor testId="my-spinner-invert-color" />
    </span>
  </div>
);

export default SpinnerExample;
