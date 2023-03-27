import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditMandatoryFieldExample = () => {
  const [editValue, setEditValue] = useState('');

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
        isRequired
      />
    </div>
  );
};
export default InlineEditMandatoryFieldExample;
