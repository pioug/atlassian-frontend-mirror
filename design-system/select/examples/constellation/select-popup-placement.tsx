import React from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import Button from '@atlaskit/button/new';
import { PopupSelect } from '../../src';

const options = [
  {
    label: 'States',
    options: [
      { label: 'Adelaide', value: 'adelaide' },
      { label: 'Brisbane', value: 'brisbane' },
      { label: 'Melbourne', value: 'melbourne' },
      { label: 'Perth', value: 'perth' },
      { label: 'Sydney', value: 'sydney' },
      { label: 'Hobart', value: 'hobart' },
    ],
  },
  {
    label: 'Territories',
    options: [
      { label: 'Canberra', value: 'canberra' },
      { label: 'Darwin', value: 'darwin' },
    ],
  },
];

const PopupSelectExample = () => {
  return (
    <PopupSelect
      searchThreshold={10}
      placeholder="Choose a city"
      options={options}
      popperProps={{ placement: 'right-start' }}
      target={({ isOpen, ...triggerProps }) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          iconAfter={ChevronDownIcon}
        >
          Open
        </Button>
      )}
    />
  );
};

export default PopupSelectExample;
