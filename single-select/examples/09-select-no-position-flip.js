import React from 'react';
import Select from '../src';

const selectItems = [
  {
    heading: 'Australia',
    items: [
      { content: 'Sydney', value: 'Sydney' },
      { content: 'Canberra', value: 'Canberra' },
      { content: 'Melbourne', value: 'Melbourne' },
      { content: 'Brisbane', value: 'Brisbane' },
      { content: 'Adelaide', value: 'Adelaide' },
      { content: 'Perth', value: 'Perth', isDisabled: true },
    ],
  },
  {
    heading: 'Germany',
    items: [
      { content: 'Berlin', value: 'Berlin' },
      { content: 'Frankfurt', value: 'Frankfurt' },
      { content: 'Mannheim', value: 'Mannheim' },
      { content: 'Hamburg', value: 'Hamburg' },
      { content: 'München', value: 'München' },
      { content: 'Hannover', value: 'Hannover' },
    ],
  },
  {
    heading: 'USA',
    items: [
      { content: 'New York', value: 'New York' },
      { content: 'San Francisco', value: 'San Francisco' },
      { content: 'Austin', value: 'Austin' },
      { content: 'Miami', value: 'Miami' },
      { content: 'Seattle', value: 'Seattle' },
    ],
  },
];

const selectedItem = selectItems[0].items[0];

const SelectNoPositionFlip = () => (
  <Select
    items={selectItems}
    isDefaultOpen
    placeholder="Select all!"
    defaultSelected={selectedItem}
    shouldFlip={false}
  />
);

export default SelectNoPositionFlip;
