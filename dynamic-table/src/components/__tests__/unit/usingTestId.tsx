import React from 'react';
import { render } from '@testing-library/react';
import { DynamicTableStateless } from '../../../';
import { head, rows } from '../../../../examples/content/sample-data';

describe('Using testId', () => {
  test('Particular elements are accessible via data-testid', () => {
    const testId = 'the-table';

    const testIds = [`${testId}--table`, `${testId}--head`, `${testId}--body`];

    const { getByTestId, getAllByTestId } = render(
      <DynamicTableStateless head={head} rows={rows} testId={testId} />,
    );

    testIds.forEach(testId => {
      expect(getByTestId(testId)).toBeTruthy();
    });

    const multipleTestIds = [
      `${testId}--head--cell`,
      `${testId}--cell-0`,
      `${testId}--cell-1`,
      `${testId}--cell-2`,
      `${testId}--cell-3`,
      `${testId}--cell-4`,
    ];

    multipleTestIds.forEach(testId => {
      expect(getAllByTestId(testId)).toBeTruthy();
    });
  });
});
