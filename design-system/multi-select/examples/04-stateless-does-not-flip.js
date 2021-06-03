import React from 'react';
import Select from '../src';

const selectItems = [
  {
    items: [
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Perth', value: 'city_4', isDisabled: true },
      { content: 'Some city with spaces', value: 'city_5' },
      { content: 'Some city with another spaces', value: 'city_6' },
      { content: 'Sydney', value: 'city_1' },
      { content: 'Canberra', value: 'city_2' },
      { content: 'Melbourne', value: 'city_3' },
      { content: 'Perth', value: 'city_4', isDisabled: true },
      { content: 'Some city with spaces', value: 'city_5' },
      { content: 'Some city with another spaces', value: 'city_6' },
    ],
  },
];

export default () => (
  <Select
    items={selectItems}
    shouldFlip={false}
    label="Choose your favourite"
    placeholder="Australia"
    name="test"
    onSelectedChange={(item) => {
      console.log(item);
    }}
    onOpenChange={() => {
      console.log('onOpenChange');
    }}
    shouldFitContainer
  />
);
