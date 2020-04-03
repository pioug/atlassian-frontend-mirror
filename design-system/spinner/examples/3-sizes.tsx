import React from 'react';
import Spinner from '../src';

export default () => (
  <div>
    <div>
      <h3>default</h3>
      <Spinner />
    </div>
    <div>
      <h3>xsmall</h3>
      <Spinner size="xsmall" />
    </div>
    <div>
      <h3>small</h3>
      <Spinner size="small" />
    </div>
    <div>
      <h3>medium</h3>
      <Spinner size="medium" />
    </div>
    <div>
      <h3>large</h3>
      <Spinner size="large" />
    </div>
    <div>
      <h3>xlarge</h3>
      <Spinner size="xlarge" />
    </div>
    <div>
      <h3>custom</h3>
      <Spinner size={35} />
    </div>
  </div>
);
