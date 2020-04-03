import React from 'react';
import Select from '../src';

const selectItems = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
    ],
  },
  {
    heading: 'Towns',
    items: [
      { content: 'Manjimup', value: 'town_1' },
      { content: 'Pemberton', value: 'town_2' },
      { content: 'Margaret River', value: 'town_3' },
    ],
  },
];

export default () => (
  <Select
    isRequired
    items={selectItems}
    label="Choose your favourite"
    shouldFitContainer
  />
);
