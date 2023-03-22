import React from 'react';

import { render } from '@testing-library/react';

import Table, {
  Cell,
  HeadCell,
  Row,
  SortableColumn,
  TBody,
  THead,
} from '../../index';

it('@atlaskit/table components should be found by data-testid', async () => {
  const { getByTestId } = render(
    <Table testId="table">
      <THead>
        <HeadCell testId="head-cell"></HeadCell>
        <SortableColumn name="Test" testId="sortable-col" />
      </THead>
      <TBody>
        <Row testId="row">
          <Cell testId="cell"></Cell>
          <Cell></Cell>
        </Row>
      </TBody>
    </Table>,
  );

  expect(getByTestId('table')).toBeTruthy();
  expect(getByTestId('head-cell')).toBeTruthy();
  // TH element itself
  expect(getByTestId('sortable-col')).toBeTruthy();
  // Sort button inside th
  expect(getByTestId('sortable-col--button')).toBeTruthy();
  expect(getByTestId('row')).toBeTruthy();
  expect(getByTestId('cell')).toBeTruthy();
});
