import React from 'react';

import Textfield from '../../src';

export default function() {
  return (
    <div>
      <label htmlFor="max">Max length of 5</label>
      <Textfield name="max" maxLength={5} />
    </div>
  );
}
