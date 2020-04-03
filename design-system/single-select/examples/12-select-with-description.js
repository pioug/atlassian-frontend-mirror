import React from 'react';
import Select from '../src';

const selectItems = [
  {
    items: [
      {
        content: 'Admin',
        value: 'role1',
        description: 'Admin can do allthethings and even more',
      },
      {
        content: 'User',
        value: 'role2',
        description: 'User is a permanent slave of the Admin',
      },
      {
        content: 'Guest',
        value: 'role3',
        description: 'Guest can only admire Admin`s grandeur from far away',
      },
    ],
  },
];

const SelectWithDescription = () => (
  <Select
    items={selectItems}
    label="Who do you trust?"
    placeholder="Choose them!"
    shouldFitContainer
  />
);

export default SelectWithDescription;
