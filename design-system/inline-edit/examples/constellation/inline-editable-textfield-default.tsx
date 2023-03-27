import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

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
        padding: `${token('space.100', '8px')} ${token(
          'space.100',
          '8px',
        )} ${token('space.600', '48px')}`,
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
