import React, { useState } from 'react';

import styled from '@emotion/styled';

import TextArea from '@atlaskit/textarea';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import InlineEdit from '../src';

const minRows = 2;
const textAreaLineHeightFactor = 2.5;

const ReadViewContainer = styled.div`
  line-height: ${(gridSize() * textAreaLineHeightFactor) / fontSize()};
  min-height: ${gridSize() * textAreaLineHeightFactor * minRows}px;
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
  word-break: break-word;
`;

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');

  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
        width: '70%',
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit textarea + keep edit view open on blur"
        editView={({ errorMessage, ...fieldProps }, ref) => (
          // @ts-ignore - textarea does not currently correctly pass through ref as a prop
          <TextArea {...fieldProps} ref={ref} />
        )}
        readView={() => (
          <ReadViewContainer>
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={setEditValue}
        keepEditViewOpenOnBlur
        readViewFitContainerWidth
      />
    </div>
  );
};

export default InlineEditExample;
