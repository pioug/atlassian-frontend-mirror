import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import {
  axe,
  JestAxeConfigureOptions,
  toHaveNoViolations,
} from '@af/accessibility-testing';
import __noop from '@atlaskit/ds-lib/noop';

import BasicExample from '../../../examples/basic';
import BasicWithActionsExample from '../../../examples/basic-with-actions';
import MultiHeaderExample from '../../../examples/multi-header';
import RowExample from '../../../examples/row';
import Table, { Cell, Row, SortableColumn, TBody, THead } from '../../index';

expect.extend(toHaveNoViolations);

const axeRules = ({
  enableFormFieldMultipleLabels,
}: {
  enableFormFieldMultipleLabels: boolean;
}): JestAxeConfigureOptions => {
  return {
    rules: {
      // As we're testing on the JSDOM, color-contrast testing can't run.
      'color-contrast': { enabled: false },
      // We need to turn this off for example tables with many selectable rows, as the
      // rule interprets the markup as having multiple labels for an element.
      'form-field-multiple-labels': { enabled: enableFormFieldMultipleLabels },
    },
    // The types of results fetched are limited for performance reasons
    resultTypes: ['violations', 'incomplete'],
  };
};

it('Basic example should not fail an aXe audit', async () => {
  const { container } = render(<BasicExample />);
  const results = await axe(
    container,
    axeRules({ enableFormFieldMultipleLabels: false }),
  );

  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Basic with actions example should not fail an aXe audit', async () => {
  const { container } = render(<BasicWithActionsExample />);
  const results = await axe(
    container,
    axeRules({ enableFormFieldMultipleLabels: false }),
  );

  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Row example should not fail an aXe audit', async () => {
  const { container } = render(<RowExample />);
  const results = await axe(
    container,
    // The fact that this test passes (one single row) means we can be confident
    // about turning this rule off for the composed table examples.
    axeRules({ enableFormFieldMultipleLabels: true }),
  );

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Multi-header example should not fail an aXe audit', async () => {
  const { container } = render(<MultiHeaderExample />);
  const results = await axe(
    container,
    axeRules({ enableFormFieldMultipleLabels: true }),
  );

  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Sortable columns have programmatically defined sorting states', async () => {
  const { getByTestId } = render(
    <Table>
      <THead>
        <SortableColumn name="Column 1" testId="col-1" />
        <SortableColumn name="Column 2" testId="col-2" />
      </THead>
      <TBody>
        <Row>
          <Cell></Cell>
          <Cell></Cell>
        </Row>
      </TBody>
    </Table>,
  );

  expect(getByTestId('col-1')).toHaveAttribute('aria-sort', 'none');
  expect(getByTestId('col-2')).toHaveAttribute('aria-sort', 'none');

  const column1SortButton = getByTestId('col-1--button');
  expect(column1SortButton).toHaveAttribute(
    'aria-roledescription',
    'Column sort button',
  );
  fireEvent.click(column1SortButton);
  expect(getByTestId('col-1')).toHaveAttribute('aria-sort', 'ascending');
  expect(getByTestId('col-2')).toHaveAttribute('aria-sort', 'none');
  fireEvent.click(column1SortButton);
  expect(getByTestId('col-1')).toHaveAttribute('aria-sort', 'descending');
  expect(getByTestId('col-2')).toHaveAttribute('aria-sort', 'none');

  const column2SortButton = getByTestId('col-2--button');
  expect(column1SortButton).toHaveAttribute(
    'aria-roledescription',
    'Column sort button',
  );
  fireEvent.click(column2SortButton);
  expect(getByTestId('col-2')).toHaveAttribute('aria-sort', 'ascending');
  expect(getByTestId('col-1')).toHaveAttribute('aria-sort', 'none');
  fireEvent.click(column2SortButton);
  expect(getByTestId('col-2')).toHaveAttribute('aria-sort', 'descending');
  expect(getByTestId('col-1')).toHaveAttribute('aria-sort', 'none');
});
