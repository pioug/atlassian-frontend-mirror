import React from 'react';

import Toggle from '../src';

export default () => (
  <div>
    <p>Regular</p>
    <Toggle isChecked={true} testId={'toggle-button'} />
    <p>Large (checked by default)</p>
    <Toggle size="large" defaultChecked />
  </div>
);
