import React from 'react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
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

	afterEach(() => {
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

		fireEvent.scroll(screen.getByTestId(virtualListScrollContainerTestId), {
			target: { scrollTop: 1000 },
		});
		await waitFor(() => {
			expect(screen.queryByText('22')).toBeInTheDocument();
			expect(onRowsRendered).toHaveBeenCalledTimes(1);
		});
	});

	it('onRowsRendered is called with correct first visible row index', async () => {
		const { container } = renderList();
		expect(container).toBeDefined();
		fireEvent.scroll(screen.getByTestId(virtualListScrollContainerTestId), {
			target: { scrollTop: 1000 },
		});
		await waitFor(() => {
			expect(onRowsRendered).toHaveBeenCalledTimes(1);
			expect(onRowsRendered).toHaveBeenCalledWith({ startIndex: 22 });
		});
	});
});
