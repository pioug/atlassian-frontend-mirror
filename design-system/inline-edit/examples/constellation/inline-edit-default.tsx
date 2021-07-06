/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';

import Textfield from '@atlaskit/textfield';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const InlineEditDefaultExample = () => {
  const [editValue, setEditValue] = useState('');

  /*
  As inline edit allows for a custom input component, styling of `ReadViewContainer` needs to be shipped with the component.
  This keeps `editView` and `readView` components aligned when switching between the two. In this particular case, these
  styles ensure `readView` is in sync with the TextField.
  */
  const ReadViewContainer = css({
    display: 'flex',
    fontSize: `${fontSize}px`,
    lineHeight: `${(gridSize * 2.5) / fontSize}`,
    maxWidth: '100%',
    minHeight: `${(gridSize * 2.5) / fontSize}em`,
    padding: `${gridSize}px ${gridSize - 2}px`,
    wordBreak: 'break-word',
  });

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield {...fieldProps} autoFocus />
        )}
        readView={() => (
          <div css={ReadViewContainer} data-testid="read-view">
            {editValue || 'Click to enter a value'}
          </div>
        )}
        onConfirm={(value) => setEditValue(value)}
      />
    </div>
  );
};

export default InlineEditDefaultExample;
