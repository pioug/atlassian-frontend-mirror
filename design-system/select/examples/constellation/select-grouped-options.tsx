import React from 'react';
import Select from '../../src';

const SelectGroupedOptionsExample = () => (
  <Select
    className="single-select"
    classNamePrefix="react-select"
    options={[
      {
        label: 'NSW',
        options: [
          { label: 'Sydney', value: 's' },
          { label: 'Newcastle', value: 'n' },
        ],
      },
      {
        label: 'QLD',
        options: [
          { label: 'Brisbane', value: 'b' },
          { label: 'Gold coast', value: 'g' },
        ],
      },
      {
        label: 'Other',
        options: [
          { label: 'Canberra', value: 'c' },
          { label: 'Williamsdale', value: 'w' },
          { label: 'Darwin', value: 'd' },
          { label: 'Perth', value: 'p' },
        ],
      },
    ]}
    placeholder="Choose a City"
  />
);

export default SelectGroupedOptionsExample;
