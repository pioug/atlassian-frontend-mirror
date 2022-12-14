import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button';

import Table, {
  Cell,
  HeadCell,
  Row,
  SortableColumn,
  TBody,
  THead,
} from '../src';

import { presidents } from './content/presidents';

/**
 * Example use case of the full 'data table'.
 *
 * Features:
 *
 * 1. Sorting
 * 2. Type data
 * 3. Selection / Multi-selection
 */
export default function Basic() {
  const [data, setData] = useState(presidents);

  const deleteId = (ids: number[]) => {
    console.log(ids);
    const updated = data.filter((president, index) => !ids.includes(index));
    setData(updated);
  };

  return (
    <Table isSelectable testId="table">
      <THead
        actions={selected => (
          <Fragment>
            <Button>Edit</Button>
            <Button onClick={() => deleteId(selected)}>Delete</Button>
          </Fragment>
        )}
      >
        <SortableColumn name="name">Name</SortableColumn>
        <SortableColumn name="party">Party</SortableColumn>
        <HeadCell>Year</HeadCell>
      </THead>
      <TBody rows={data}>
        {row => (
          <Row key={row.id} {...row}>
            <Cell>{row.name}</Cell>
            <Cell>{row.party}</Cell>
            <Cell>{row.term}</Cell>
          </Row>
        )}
      </TBody>
    </Table>
  );
}
