import React from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import DynamicTable, {
  DynamicTableStateless as StatelessDynamicTable,
} from '../../../index';
import { StatelessProps } from '../../../types';
import LoadingContainer from '../../loading-container';
import { RankableTableCell } from '../../rankable/table-cell';

import {
  cellWithKey as cell,
  head,
  rows,
  rowsWithKeys,
  sortKey,
} from './_data';

const testId = 'dynamic--table--test--id';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

describe('Dynamic Table Accessibility', () => {
  afterEach(cleanup);

  describe('Stateful table', () => {
    it('default stateful should pass basic aXe audit', async () => {
      render(
        <DynamicTable
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
          testId={testId}
        />,
      );

      const container = screen.getByTestId('dynamic--table--test--id--table');
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });

    it('stateful with pagination should pass basic aXe audit', async () => {
      render(
        <DynamicTable
          rowsPerPage={2}
          defaultPage={2}
          head={head}
          rows={rows}
          testId={testId}
        />,
      );

      const container = screen.getByTestId(
        'dynamic--table--test--id--loading--container--advanced',
      );
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Stateless table', () => {
    const createStatelessProps: () => StatelessProps = () => ({
      head,
      rows: rowsWithKeys,
      sortKey,
      sortOrder: 'ASC',
      onSort: jest.fn(),
      onPageRowsUpdate: jest.fn(),
      testId,
    });

    it('default stateless should pass basic aXe audit', async () => {
      const props = createStatelessProps();
      render(<StatelessDynamicTable {...props} />);

      const container = screen.getByTestId('dynamic--table--test--id--table');
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });

    it('when changed from ASC to DESC, should pass basic aXe audit', async () => {
      const props = createStatelessProps();
      const { getAllByRole } = render(
        <StatelessDynamicTable {...props} sortOrder="DESC" />,
      );

      const sortButtons = getAllByRole('button');
      fireEvent.click(sortButtons[0]);

      const container = screen.getByTestId('dynamic--table--test--id--table');
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });

    it('with pagination, should pass basic aXe audit', async () => {
      const props = createStatelessProps();
      render(
        <StatelessDynamicTable {...props} totalRows={25} rowsPerPage={10} />,
      );

      const container = screen.getByTestId(
        'dynamic--table--test--id--loading--container--advanced',
      );
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });
  });

  describe('With Loading Container', () => {
    it('should pass basic aXe audit', async () => {
      render(
        <LoadingContainer testId={testId}>
          <div data-testid={`${testId}--contents`}>Contents</div>
        </LoadingContainer>,
      );

      const container = screen.getByTestId(
        'dynamic--table--test--id--container',
      );
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });
  });

  describe('With Rankable Table Cell', () => {
    const createRankableProps = () => ({
      cell,
      head: head.cells[0],
      isRanking: false,
      innerRef: jest.fn(),
      refWidth: -1,
      refHeight: -1,
      isFixedSize: false,
      testId,
    });

    it('should pass basic aXe audit', async () => {
      const props = createRankableProps();
      const trKeyDownPropagation = jest.fn();
      render(
        <table>
          <tbody>
            <tr data-testid={`${testId}--tr`} onKeyDown={trKeyDownPropagation}>
              <RankableTableCell {...props} />
            </tr>
          </tbody>
        </table>,
      );

      const cell = screen.getByTestId(`${testId}--rankable--table--body--cell`);
      fireEvent.keyDown(cell);

      const container = screen.getByTestId('dynamic--table--test--id--tr');
      const results = await axe(container, axeRules);
      expect(results).toHaveNoViolations();
    });
  });
});
