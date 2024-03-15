import React from 'react';

import { render, screen } from '@testing-library/react';

import { head, rows } from '../../../../examples/content/sample-data';
import DynamicTableStateful, { DynamicTableStateless } from '../../../index';

describe('Using testId', () => {
  test('Particular elements are accessible via data-testid', () => {
    const testId = 'the-table';

    const testIds = [
      `${testId}--table`,
      `${testId}--head`,
      `${testId}--body`,
      `${testId}--pagination`,
    ];

    render(
      <DynamicTableStateless
        head={head}
        rows={rows}
        testId={testId}
        rowsPerPage={3}
        page={1}
      />,
    );

    testIds.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    const multipleTestIds = [
      `${testId}--head--cell`,
      `${testId}--cell-0`,
      `${testId}--cell-1`,
      `${testId}--cell-2`,
      `${testId}--cell-3`,
      `${testId}--cell-4`,
    ];

    multipleTestIds.forEach((testId) => {
      // Currently, a non-rankable table does not prefix the cell test IDs
      // with the current table row, therefore it is possible to have multiple
      // cells on separate rows to have the same test ID.
      // eslint-disable-next-line jest-dom/prefer-in-document
      expect(screen.getAllByTestId(testId)).toBeTruthy();
    });
  });

  describe('setting custom testIds on cells', () => {
    const head = { cells: [{ content: 'Greeting' }] };
    const rows = [
      {
        key: 'row-1',
        cells: [
          {
            testId: 'cell-1',
            content: 'Hello',
          },
        ],
      },
    ];

    test('within a stateless table, testIds set on a cell should be set as a data attribute, not a custom attribute', () => {
      render(<DynamicTableStateless head={head} rows={rows} />);

      const cell = screen.getByText('Hello');
      expect(cell).not.toHaveAttribute('testid', 'cell-1');
      expect(cell).toHaveAttribute('data-testid', 'cell-1');
    });

    test('within a stateful table, testIds set on a cell should be set as a data attribute, not a custom attribute', () => {
      render(<DynamicTableStateful head={head} rows={rows} />);

      const cell = screen.getByText('Hello');
      expect(cell).not.toHaveAttribute('testid', 'cell-1');
      expect(cell).toHaveAttribute('data-testid', 'cell-1');
    });
  });
});
