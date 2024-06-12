import React from 'react';

import { render, screen } from '@testing-library/react';

import { head, rows, rowsWithTestIdOverrides } from '../../../../examples/content/sample-data';
import DynamicTableStateful, { DynamicTableStateless } from '../../../index';

describe('Test IDs', () => {
	test('allow elements to be accessible for testing', () => {
		const testId = 'the-table';

		const testIds = [
			`${testId}--table`,
			`${testId}--head`,
			`${testId}--body`,
			`${testId}--pagination`,
			`${testId}--row-thomas-jefferson`,
		];

		render(
			<DynamicTableStateless head={head} rows={rows} testId={testId} rowsPerPage={3} page={1} />,
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
			screen.getAllByTestId(testId).forEach((element) => {
				expect(element).toBeInTheDocument();
			});
		});
	});

	test('should allow base test ID overrides when passed to `rows` and `cells`', () => {
		const testId = 'the-table';

		const testIds = [
			'foo--row-george-washington',
			'foo--row-john-adams',
			'foo--row-thomas-jefferson',
		];

		render(
			<DynamicTableStateless
				head={head}
				rows={rowsWithTestIdOverrides}
				testId={testId}
				rowsPerPage={3}
				page={1}
			/>,
		);

		testIds.forEach((testId) => {
			expect(screen.getByTestId(testId)).toBeInTheDocument();
		});

		const multipleTestIds = [
			'foo--cell-george-washington',
			'foo--cell-none-federalist',
			'foo--cell-1',
			'foo--cell-lorem',
			'foo--cell-more-dropdown',
		];

		multipleTestIds.forEach((testId) => {
			screen.getAllByTestId(testId).forEach((element) => {
				expect(element).toBeInTheDocument();
			});
		});
	});

	describe('should be set as a data attribute on cells, not a custom attribute', () => {
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
