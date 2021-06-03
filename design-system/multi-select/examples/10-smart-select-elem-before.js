import React from 'react';
import Avatar from '@atlaskit/avatar';
import Select from '../src';

function createItem(key, presence, disabled = false) {
  return {
    content: `Anonymous User ${key}`,
    filterValues: [`Anonymous User ${key}`, `user_${key}@example.com`],
    description: `user_${key}@example.com`,
    elemBefore: <Avatar size="small" presence={presence} />,
    isDisabled: disabled,
    value: `user_${key}`,
    tag: {
      elemBefore: <Avatar size="xsmall" />,
      appearance: 'rounded',
    },
  };
}

const selectItems = [
  {
    items: [
      createItem(1, 'online'),
      createItem(2, 'online'),
      createItem(3, 'busy', true),
      createItem(4, 'offline'),
      createItem(5, 'busy'),
    ],
  },
];

export default () => (
  <Select
    items={selectItems}
    label="Select users to invite"
    placeholder="Type username or email..."
    name="test"
    onSelectedChange={(item) => {
      console.log(item);
    }}
    shouldFitContainer
  />
);
