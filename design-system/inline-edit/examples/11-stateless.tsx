import React, { useState } from 'react';

import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  display: flex;
  font-size: ${fontSize()}px;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');
  const [isEditing, setEditing] = useState(true);

  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        isEditing={isEditing}
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield {...fieldProps} autoFocus />
        )}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onCancel={() => setEditing(false)}
        onConfirm={(value: string) => {
          setEditValue(value);
          setEditing(false);
        }}
        onEdit={() => setEditing(true)}
      />
    </div>
  );
};

export default InlineEditExample;
