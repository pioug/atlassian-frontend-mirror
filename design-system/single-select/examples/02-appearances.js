import React from 'react';
import Select from '../src';

const selectItems = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Perth', value: 'city_4', isDisabled: true },
    ],
  },
];

const selectedItem = selectItems[0].items[0];

const Appearances = () => (
  <div>
    <Select
      appearance="default"
      items={selectItems}
      label="default"
      defaultSelected={selectedItem}
    />
    {' or '}
    <Select
      appearance="subtle"
      items={selectItems}
      label="subtle"
      defaultSelected={selectedItem}
    />
  </div>
);

export default Appearances;
