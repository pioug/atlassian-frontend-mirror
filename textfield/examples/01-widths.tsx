import React from 'react';
import Textfield from '../src';

export default function() {
  return (
    <div>
      <label htmlFor="xsmall">xsmall</label>
      <Textfield name="xsmall" width="xsmall" />

      <label htmlFor="small">small</label>
      <Textfield name="small" width="small" />

      <label htmlFor="medium">medium</label>
      <Textfield name="medium" width="medium" />

      <label htmlFor="large">large</label>
      <Textfield name="large" width="large" />

      <label htmlFor="xlarge">xlarge</label>
      <Textfield name="xlarge" width="xlarge" />

      <label htmlFor="custom-width">custom width (eg, 546)</label>
      <Textfield name="custom-width" width="546" />

      <label htmlFor="default">default (100%)</label>
      <Textfield name="default" />
    </div>
  );
}
