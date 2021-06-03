import React, { useState } from 'react';

import { InlineEditableTextfield } from '../src';

export default () => {
  const [editValue, setEditValue] = useState('Field value');

  return (
    <InlineEditableTextfield
      defaultValue={editValue}
      label="Inline editable textfield"
      onConfirm={(value) => setEditValue(value)}
      placeholder="Click to enter text"
    />
  );
};
