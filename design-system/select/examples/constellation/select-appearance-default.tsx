import React from 'react';

import Select from '../../src';

export default function SelectAppearanceDefault() {
  return (
    <Select
      label="Default"
      appearance="default"
      options={[
        { label: 'Apple', value: 'a' },
        { label: 'Banana', value: 'b' },
      ]}
    />
  );
}
