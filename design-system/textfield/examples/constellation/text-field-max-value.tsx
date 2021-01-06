import React from 'react';

import Textfield from '../../src';

export default function TextFieldMaxValueExample() {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="max">
        Max length of 5
        <Textfield id="max" name="max" maxLength={5} />
      </label>
    </div>
  );
}
