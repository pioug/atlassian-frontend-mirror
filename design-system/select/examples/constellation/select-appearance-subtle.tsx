import React from 'react';

import Select from '../../src';

export default function SelectAppearanceSubtle() {
  return (
    <Select
      label="Subtle"
      appearance="subtle"
      options={[
        { label: 'Apple', value: 'a' },
        { label: 'Banana', value: 'b' },
      ]}
    />
  );
}
