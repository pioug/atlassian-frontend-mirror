import React from 'react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import {
	VirtualList,
	virtualListScrollContainerTestId,
} from '../../../../components/picker/VirtualList';
import { renderWithIntl } from '../../_testing-library';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('VirtualList', () => {
	const onRowsRendered = jest.fn();
	let getExperimentValueSpy: jest.SpiedFunction<typeof FeatureGates.getExperimentValue>;

	const renderList = () => {
		return renderWithIntl(
			<VirtualList
				overscanRowCount={3}
				rowHeight={() => 40}
				rowRenderer={(virtualRow) => <div>{virtualRow.index}</div>}
				onRowsRendered={onRowsRendered}
				rowCount={40}
				scrollToAlignment={'start'}
				width={200}
				height={400}
			/>,
		);
	};

	const mockRenderedRowBounds = () => {
		const scrollContainer = screen.getByTestId(virtualListScrollContainerTestId);
		scrollContainer.getBoundingClientRect = jest.fn(
			() =>
				({
					top: 0,
					bottom: 400,
				}) as DOMRect,
		);

		Array.from(scrollContainer.firstElementChild?.children ?? []).forEach((row, rowIndex) => {
			row.getBoundingClientRect = jest.fn(
				() =>
					({
						top: rowIndex * 40,
						bottom: rowIndex * 40 + 40,
					}) as DOMRect,
			);
		});
	};

	beforeEach(() => {
		failGate('platform_a11y_fixes_reaction_emoji');
		getExperimentValueSpy = jest
			.spyOn(FeatureGates, 'getExperimentValue')
			.mockImplementation((_experimentName, _parameterName, defaultValue) => defaultValue);
	});

	afterEach(() => {
		getExperimentValueSpy.mockRestore();
		jest.resetAllMocks();
		cleanup();
	});

	it('renders', async () => {
		const { container } = renderList();
		expect(container).toBeDefined();
	});

	it('renders the correct list when scrolled', async () => {
		const { container } = renderList();
		expect(container).toBeDefined();

		await waitFor(() => {
			expect(screen.queryByText('3')).toBeInTheDocument();
		});

		onRowsRendered.mockClear();
		fireEvent.scroll(screen.getByTestId(virtualListScrollContainerTestId), {
			target: { scrollTop: 1000 },
		});
		await waitFor(() => {
			expect(screen.queryByText('22')).toBeInTheDocument();
			expect(onRowsRendered).toHaveBeenCalled();
		});
	});

	it('onRowsRendered is called with correct first visible row index', async () => {
		const { container } = renderList();
		expect(container).toBeDefined();
		await waitFor(() => {
			expect(screen.queryByText('3')).toBeInTheDocument();
		});

		onRowsRendered.mockClear();
		fireEvent.scroll(screen.getByTestId(virtualListScrollContainerTestId), {
			target: { scrollTop: 1000 },
		});
		await waitFor(() => {
			expect(screen.queryByText('22')).toBeInTheDocument();
		});
		mockRenderedRowBounds();
		onRowsRendered.mockClear();
		fireEvent.scroll(screen.getByTestId(virtualListScrollContainerTestId), {
			target: { scrollTop: 1000 },
		});
		await waitFor(() => {
			expect(onRowsRendered).toHaveBeenCalledWith({ startIndex: 22 });
		});
	});
});
