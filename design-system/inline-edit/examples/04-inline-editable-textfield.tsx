import React, { useState } from 'react';

import { gridSize } from '@atlaskit/theme/constants';

import { InlineEditableTextfield } from '../src';

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');

  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
      }}
    >
      <InlineEditableTextfield
        defaultValue={editValue}
        label="Inline editable textfield"
        onConfirm={value => setEditValue(value)}
        placeholder="Click to enter text"
      />
    </div>
  );
};
export default InlineEditExample;
