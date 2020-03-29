import React from 'react';
import Select from '../src';

const selectItems = [
  {
    items: [
      { content: <span>Sydney</span>, value: 'sydney', label: 'Sydney' },
      { content: <span>Canberra</span>, value: 'canberra', label: 'Canberra' },
      {
        content: <span>Perth</span>,
        value: 'perth',
        label: 'Perth',
        filterValues: ['PPP'],
        description: "(matches 'PPP' and not 'Perth')",
      },
      {
        content: <span>Melbourne</span>,
        value: 'melbourne',
        label: 'Melbourne',
        isDisabled: true,
      },
    ],
  },
];

const selectedItem = selectItems[0].items[1];

const SelectAutocompleteJSXContent = () => (
  <Select defaultSelected={selectedItem} hasAutocomplete items={selectItems} />
);

export default SelectAutocompleteJSXContent;
