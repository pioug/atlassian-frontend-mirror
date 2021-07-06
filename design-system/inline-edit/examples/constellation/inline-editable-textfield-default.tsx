import React, { useState } from 'react';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

import { InlineEditableTextfield } from '../../src';

const gridSize = getGridSize();

const InlineEditableTextfieldDefault = () => {
  const [editValue, setEditValue] = useState('');

  const validate = (value: string) => {
    if (value.length <= 6) {
      return 'Please enter a value greater than 6 characters';
    }
    return undefined;
  };

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
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
export default InlineEditableTextfieldDefault;
