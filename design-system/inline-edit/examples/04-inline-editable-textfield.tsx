import React, { useState } from 'react';

import { gridSize } from '@atlaskit/theme/constants';

import { InlineEditableTextfield } from '../src';

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');

  const validate = (value: string) => {
    if (value.length <= 6) {
      return 'Enter a value longer than 6 characters';
    }
    return undefined;
  };

  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
      }}
    >
      <InlineEditableTextfield
        defaultValue={editValue}
        label="Inline editable textfield"
        onConfirm={(value) => setEditValue(value)}
        placeholder="Click to enter text"
        validate={validate}
      />
    </div>
  );
};
export default InlineEditExample;
