import React from 'react';

import styled from '@emotion/styled';

import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  display: flex;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

const InlineEditExample = () => (
  <div
    style={{
      padding: `${gridSize()}px ${gridSize()}px`,
      fontSize: '24px',
      fontWeight: 'bold',
      lineHeight: '24px',
    }}
  >
    <InlineEdit
      defaultValue="Field value"
      onConfirm={() => {}}
      editView={(fieldProps) => (
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
      readView={() => <ReadViewContainer>Field value</ReadViewContainer>}
    />
  </div>
);
export default InlineEditExample;
