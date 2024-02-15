import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditableTextfieldCompactExample = () => {
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
        label="Team name"
        onConfirm={(value) => setEditValue(value)}
        placeholder="Enter your team name"
        isCompact
      />
    </div>
  );
};
export default InlineEditableTextfieldCompactExample;
