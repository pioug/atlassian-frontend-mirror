import React from 'react';

import Table, { Cell, HeadCell, Row, TBody, THead } from '../src';

import { presidents } from './content/presidents';

/**
 * Primary UI component for user interaction
 */
const CompositionExample = () => {
  return (
    <Table testId="table">
      <THead>
        <HeadCell>Name</HeadCell>
        <HeadCell>Party</HeadCell>
        <HeadCell>Year</HeadCell>
      </THead>
      <TBody>
        {presidents.map(row => (
          <Row key={row.id}>
            <HeadCell backgroundColor="neutral" scope="row">
              {row.name}
            </HeadCell>
            <Cell>{row.party}</Cell>
            <Cell>{row.term}</Cell>
          </Row>
        ))}
      </TBody>
    </Table>
  );
};

export default CompositionExample;
