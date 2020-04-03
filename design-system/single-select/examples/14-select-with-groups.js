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
  {
    heading: 'Countries',
    items: [
      { content: 'Australia', value: 'country_1' },
      { content: 'New Zealand', value: 'country_2' },
      { content: 'UK', value: 'country_3' },
      { content: 'Switzerland', value: 'country_4' },
    ],
  },
];

const SelectWithGroups = () => (
  <div style={{ width: '150px' }}>
    <Select items={selectItems} placeholder="Select me!" shouldFitContainer />
  </div>
);

export default SelectWithGroups;
