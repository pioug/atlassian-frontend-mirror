import React from 'react';
import Select from '../src';

const selectItems = [
  {
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Perth', value: 'city_4', isDisabled: true },
    ],
  },
];

const selectedItem = selectItems[0].items[0];

const SelectWithAutocomplete = () => (
  <Select
    defaultSelected={selectedItem}
    hasAutocomplete
    items={selectItems}
    placeholder="Select all!"
  />
);

export default SelectWithAutocomplete;
