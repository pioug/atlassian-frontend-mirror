import React from 'react';
import Select from '../src';

const GROUP_OPTIONS = [
  {
    label: 'Group I',
    options: [
      { label: 'Adelaide', value: 'adelaide' },
      { label: 'Brisbane', value: 'brisbane' },
    ],
  },
  {
    label: 'Group II',
    options: [
      { label: 'Canberra', value: 'canberra' },
      { label: 'Darwin', value: 'darwin' },
    ],
  },
];

const SingleExample = () => (
  <Select options={GROUP_OPTIONS} placeholder="Choose a City" />
);

export default SingleExample;
