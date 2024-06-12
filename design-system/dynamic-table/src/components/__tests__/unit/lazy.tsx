import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { DynamicTableStateless } from '../../../index';

import { head, rowsWithKeys } from './_data';

describe('lazy loading of react-beautiful-dnd', () => {
	const testId = 'dynamic--table--test--id';

	it('should display a non rankable row if lazy loading fails', async () => {
		jest.mock('react-beautiful-dnd', () => {
			throw new Error('cannot load');
		});

		const consoleError = jest.spyOn(console, 'error').mockImplementation(noop);

		render(
			<DynamicTableStateless
				rowsPerPage={2}
				page={2}
				head={head}
				rows={rowsWithKeys}
				isRankable
				testId={testId}
			/>,
		);

		/**
		 * Waiting for the lazy component to load (unsuccessfully)
		 */
		await waitFor(() => {
			expect(consoleError).toHaveBeenCalledWith(
				expect.stringContaining(
					'React will try to recreate this component tree from scratch using the error boundary you provided',
				),
			);
		});

		const body = screen.getByTestId(`${testId}--body`);
		const rankableBody = screen.queryByTestId(testId);

		expect(body).toBeInTheDocument();
		expect(rankableBody).not.toBeInTheDocument();
	});

	it('should not load react-beautiful-dnd for non-rankable tables', async () => {
		const mockRbd = jest.fn();
		jest.mock('react-beautiful-dnd', () => {
			mockRbd();
		});

		render(
			<DynamicTableStateless
				rowsPerPage={2}
				page={2}
				head={head}
				rows={rowsWithKeys}
				isRankable={false}
				testId={testId}
			/>,
		);

		/**
		 * Using this to flush effects and ensure that the
		 * lazy loading would have triggered.
		 */
		await act(() => new Promise(process.nextTick));

		expect(mockRbd).not.toHaveBeenCalled();
	});
});
