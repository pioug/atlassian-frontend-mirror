import React, { useState } from 'react';

import Textfield from '@atlaskit/textfield';

import InlineEdit from '../src';

export default () => {
  const [editValue, setEditValue] = useState('Field value');
  return (
    <InlineEdit
      defaultValue={editValue}
      label="Inline edit"
      editView={(fieldProps) => <Textfield {...fieldProps} autoFocus />}
      readView={() => <div>{editValue || 'Click to enter value'}</div>}
      onConfirm={(value) => setEditValue(value)}
    />
  );
};
