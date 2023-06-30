import React from 'react';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { PopupSelect } from '../../src';

const options = [
  { label: 'accessibility', value: 'accessibility' },
  { label: 'analytics', value: 'analytics' },
  { label: 'ktlo', value: 'ktlo' },
  { label: 'testing', value: 'testing' },
  { label: 'regression', value: 'regression' },
  { label: 'layering', value: 'layering' },
  { label: 'innovation', value: 'innovation' },
  { label: 'new-feature', value: 'new' },
  { label: 'existing', value: 'existing' },
  { label: 'wont-do', value: 'wont-do' },
];

const PopupSelectExample = () => {
  return (
    <PopupSelect
      placeholder="Search labels..."
      options={options}
      target={({ isOpen, ...triggerProps }) => (
        <Button {...triggerProps} iconAfter={<ChevronDownIcon label="" />}>
          Label
        </Button>
      )}
    />
  );
};

export default PopupSelectExample;
