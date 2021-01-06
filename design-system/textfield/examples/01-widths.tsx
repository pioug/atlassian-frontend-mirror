import React from 'react';

import Textfield from '../src';

export default function WidthsExample() {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="xsmall">xsmall</label>
      <Textfield name="xsmall" width="xsmall" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="small">small</label>
      <Textfield name="small" width="small" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="medium">medium</label>
      <Textfield name="medium" width="medium" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="large">large</label>
      <Textfield name="large" width="large" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="xlarge">xlarge</label>
      <Textfield name="xlarge" width="xlarge" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="custom-width">custom width (eg, 546)</label>
      <Textfield name="custom-width" width="546" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="default">default (100%)</label>
      <Textfield name="default" />
    </div>
  );
}
