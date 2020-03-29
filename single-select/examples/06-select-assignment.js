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

const selectItems2 = [
  {
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Sydney - 2', value: 'city_4' },
      { content: 'Canberra - 2', value: 'city_5' },
      { content: 'Melbourne - 2', value: 'city_6' },
      { content: 'Sydney - 3', value: 'city_7' },
      { content: 'Canberra - 3', value: 'city_8' },
      { content: 'Melbourne - 3', value: 'city_9' },
      { content: 'Sydney - 4', value: 'city_10' },
      { content: 'Canberra - 4', value: 'city_11' },
      { content: 'Melbourne - 4', value: 'city_12' },
    ],
  },
];

const selectItems3 = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
    ],
  },
  {
    heading: 'Another',
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Sydney - 1', value: 'city_4' },
      { content: 'Canberra - 1', value: 'city_5' },
      { content: 'Melbourne - 1', value: 'city_6' },
      { content: 'Sydney - 2', value: 'city_7' },
      { content: 'Canberra - 2', value: 'city_8' },
      { content: 'Melbourne - 2', value: 'city_9' },
    ],
  },
];

const SelectAssignment = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Select items={selectItems} placeholder="Select me!" />
    or
    <Select items={selectItems2} placeholder="Me! Me! Me! " />
    or
    <Select items={selectItems3} placeholder="I'm also good" />
  </div>
);

export default SelectAssignment;
