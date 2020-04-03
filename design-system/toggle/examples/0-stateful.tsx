import React from 'react';
import Toggle from '../src';

export default () => (
  <div>
    <p>Regular</p>
    <Toggle />
    <p>Large (checked by default)</p>
    <Toggle size="large" isDefaultChecked />
  </div>
);
