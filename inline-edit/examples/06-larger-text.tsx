import React from 'react';
import styled from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme';
import Textfield from '@atlaskit/textfield';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  display: flex;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

export default class InlineEditExample extends React.Component {
  render() {
    return (
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
          editView={fieldProps => (
            <Textfield
              {...fieldProps}
              autoFocus
              theme={(theme: any, props: any) => {
                const { container, input } = theme(props);
                return {
                  container: {
                    ...container,
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                  },
                  input: {
                    ...input,
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                  },
                };
              }}
            />
          )}
          readView={() => <ReadViewContainer>Field value</ReadViewContainer>}
        />
      </div>
    );
  }
}
