/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  margin: 8px 0px;
`;

const Message = styled.div`
  background-color: ${token(
    'color.background.boldDanger.resting',
    'orangered',
  )};
  color: ${token('color.text.onBold', 'white')};
  padding: 8px;
  margin: 8px 0;
  border-radius: 3px;
`;

const HeadingOne = styled.h1`
  font-size: 24px;
  font-weight: 500;
  line-height: inherit;
`;

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');

  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield
            {...fieldProps}
            autoFocus
            css={{
              '& > [data-ds--text-field--input]': {
                fontSize: 24,
                padding: '8px 6px',
                margin: '-11px -4px',
              },
            }}
          />
        )}
        readView={() => (
          <ReadViewContainer>
            <HeadingOne>{editValue || 'Click to enter value'}</HeadingOne>
          </ReadViewContainer>
        )}
        onConfirm={(value) => setEditValue(value)}
      />

      <Message>Some content beneath a inline edit as a placeholder</Message>
    </div>
  );
};

export default InlineEditExample;
