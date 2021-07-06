import React, { useState } from 'react';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

import { InlineEditableTextfield } from '../../src';

const gridSize = getGridSize();

const InlineEditStartEditExample = () => {
  const [editValue, setEditValue] = useState('');

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
      }}
    >
      <InlineEditableTextfield
        testId="editable-text-field"
        defaultValue={editValue}
        label="Inline editable textfield"
        onConfirm={(value) => setEditValue(value)}
        placeholder="Click to enter text"
        startWithEditViewOpen
      />
    </div>
  );
};
export default InlineEditStartEditExample;
