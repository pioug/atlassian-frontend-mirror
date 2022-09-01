/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = css({
  display: 'flex',
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${gridSize}px ${gridSize - 2}px`,
  fontSize: `${fontSize}px`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
  wordBreak: 'break-word',
});

const InlineEditStatelessExample = () => {
  const [editValue, setEditValue] = useState('');
  const [isEditing, setEditing] = useState(true);

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
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
          <div css={readViewContainerStyles} data-testid="read-view">
            {editValue || 'Click to enter value'}
          </div>
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

export default InlineEditStatelessExample;
