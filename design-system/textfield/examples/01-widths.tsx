import React from 'react';

import Textfield from '../src';

export default function WidthsExample() {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="xsmall">xsmall</label>
      <Textfield name="xsmall" width="xsmall" id="xsmall" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="small">small</label>
      <Textfield name="small" width="small" id="small" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="medium">medium</label>
      <Textfield name="medium" width="medium" id="medium" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="large">large</label>
      <Textfield name="large" width="large" id="large" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="xlarge">xlarge</label>
      <Textfield name="xlarge" width="xlarge" id="xlarge" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="custom-width">custom width (eg, 546)</label>
      <Textfield name="custom-width" width="546" id="custom-width" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="default">default (100%)</label>
      <Textfield name="default" id="default" />
    </div>
  );
}
