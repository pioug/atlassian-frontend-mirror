import React from 'react';
import Select from '../src';

const selectItems = [
  {
    heading: 'East Coast',
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
    ],
  },
  {
    heading: 'West Coast',
    items: [
      { content: 'Perth', value: 'city_4' },
      { content: 'Bunbury', value: 'city_5' },
    ],
  },
];

const ItemsOverview = () => (
  <Select
    items={selectItems}
    label="Choose your favourite"
    shouldFitContainer
  />
);

export default ItemsOverview;
