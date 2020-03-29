import React from 'react';
import Select from '../src';

const selectItems = [
  {
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
    ],
  },
];

export default () => (
  <Select
    isDisabled
    items={selectItems}
    label="Choose your favourite"
    shouldFitContainer
  />
);
