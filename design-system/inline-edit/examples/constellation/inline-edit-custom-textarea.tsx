/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';

import TextArea from '@atlaskit/textarea';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();
const minRows = 2;
const textAreaLineHeightFactor = 2.5;

const ReadViewContainer = css({
  lineHeight: `${(gridSize * textAreaLineHeightFactor) / fontSize}`,
  minHeight: `${gridSize * textAreaLineHeightFactor * minRows}px`,
  padding: `${gridSize - 2}px ${gridSize - 2}px`,
  wordBreak: 'break-word',
});

const InlineEditCustomTextareaExample = () => {
  const [editValue, setEditValue] = useState('');

  return (
    <div
      style={{
        padding: `${gridSize}px ${gridSize}px ${gridSize * 6}px`,
        width: '70%',
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit textarea (keeps edit view on blur)"
        editView={({ errorMessage, ...fieldProps }, ref) => (
          // @ts-ignore - textarea does not pass through ref as a prop
          <TextArea {...fieldProps} ref={ref} />
        )}
        readView={() => (
          <div css={ReadViewContainer}>
            {editValue || 'Click to enter a value'}
          </div>
        )}
        onConfirm={setEditValue}
        keepEditViewOpenOnBlur
        readViewFitContainerWidth
      />
    </div>
  );
};

export default InlineEditCustomTextareaExample;
