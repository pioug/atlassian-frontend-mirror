import React from 'react';

import Select from '../../src';

export default function SelectAppearanceNone() {
  return (
    <Select
      label="None"
      appearance="none"
      options={[
        { label: 'Apple', value: 'a' },
        { label: 'Banana', value: 'b' },
      ]}
    />
  );
}
