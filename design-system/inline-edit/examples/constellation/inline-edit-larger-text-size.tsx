import React, { useState } from 'react';

import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const ReadViewContainer = styled.div`
  display: flex;
  line-height: ${(gridSize * 2.5) / fontSize};
  max-width: 100%;
  min-height: ${(gridSize * 2.5) / fontSize}em;
  padding: ${gridSize}px ${gridSize - 2}px;
  word-break: break-word;
`;

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('');

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px`,
        fontSize: '24px',
        fontWeight: 'bold',
        lineHeight: '24px',
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield
            {...fieldProps}
            autoFocus
            css={{
              fontSize: 'inherit',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              '& > [data-ds--text-field--input]': {
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
              },
            }}
          />
        )}
        readView={() => (
          <div css={ReadViewContainer} data-testid="read-view">
            {editValue || 'Click to enter text'}
          </div>
        )}
        onConfirm={(value) => {
          setEditValue(value);
        }}
      />
    </div>
  );
};

export default InlineEditExample;
