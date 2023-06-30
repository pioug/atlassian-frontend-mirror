import React from 'react';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { PopupSelect, CheckboxOption } from '@atlaskit/select';

const options = [
  { label: 'All standard issue types', value: 'standard' },
  { label: 'All sub-task issue types', value: 'sub-task' },
  {
    label: 'Standard issue types',
    options: [
      { label: 'Epic', value: 'epic' },
      { label: 'Initiative', value: 'initiative' },
      { label: 'Task', value: 'task' },
    ],
  },
  {
    label: 'Sub-task issue types',
    options: [
      { label: 'Feature', value: 'feature' },
      { label: 'Bug', value: 'bug' },
    ],
  },
];

const PopupSelectExample = () => {
  return (
    <PopupSelect
      components={{ Option: CheckboxOption }}
      options={options}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isMulti
      aria-label="Filter issue types"
      placeholder="Filter issue types..."
      target={({ isOpen, ...triggerProps }) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          iconAfter={<ChevronDownIcon label="" />}
        >
          Type
        </Button>
      )}
    />
  );
};

export default PopupSelectExample;
