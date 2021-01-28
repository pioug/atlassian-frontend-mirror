import React from 'react';
import styled from 'styled-components';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const Cell = styled.div<{ width?: number }>`
  max-width: 100%;
  flex: 0 0 auto;
  width: ${({ width }) => `${width}px` || 'auto'};
`;

const renderRows = (count: number) => {
  const rows: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    rows.push(
      <Row>
        <Cell width={300}>KEY-{i}</Cell>
        <Cell width={100}>
          <ExampleWrapper>
            {({ options, onInputChange }) => (
              <UserPicker
                fieldId="example"
                menuPortalTarget={document.body}
                options={options}
                onInputChange={onInputChange}
                onChange={console.log}
              />
            )}
          </ExampleWrapper>
        </Cell>
      </Row>,
    );
  }
  return rows;
};

const Example = () => {
  return (
    <Table>
      <Row>
        <Cell width={300}>Issue</Cell>
        <Cell width={100}>Assign</Cell>
      </Row>
      {renderRows(50)}
    </Table>
  );
};
export default Example;
