import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../src';

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');

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
        testId="editable-text-field"
        defaultValue={editValue}
        label="Inline editable textfield"
        onConfirm={(value) => setEditValue(value)}
        placeholder="Click to enter text"
        hideActionButtons
      />
    </div>
  );
};
export default InlineEditExample;
