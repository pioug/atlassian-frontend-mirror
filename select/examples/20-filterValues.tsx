import React from 'react';
import Select, { OptionType } from '../src';

const getOptionValue = (option: OptionType) => {
  if (option.filterValues && option.filterValues.length) {
    return option.filterValues.join(', ');
  }
  return option.value;
};

const ElementBeforeExample = () => (
  <Select
    getOptionValue={getOptionValue}
    options={[
      {
        label: 'Adelaide',
        value: 'adelaide',
        filterValues: ['wine country', 'the good country', 'adelaide'],
      },
      {
        label: 'Brisbane',
        value: 'brisbane',
        filterValues: [
          'Vegas of the Southern Hemisphere',
          'BrisVegas',
          'brisbane',
        ],
      },
      {
        label: 'Canberra',
        value: 'canberra',
        filterValues: ['ACT', 'canberra'],
      },
      { label: 'Darwin', value: 'darwin' },
      {
        label: 'Hobart',
        value: 'hobart',
        filterValues: ['cheese country', 'cradle mountain', 'hobart'],
      },
      {
        label: 'Melbourne',
        value: 'melbourne',
        filterValues: [
          'aussie europe',
          'better sydney',
          'cultural hub of australia',
          'melbourne',
        ],
      },
      { label: 'Perth', value: 'perth', filterValues: ['where?', 'perth'] },
      {
        label: 'Sydney',
        value: 'sydney',
        filterValues: [
          'good luck finding affordable housing here',
          'lockouts',
          'sydney',
        ],
      },
    ]}
  />
);

export default ElementBeforeExample;
