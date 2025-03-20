import React from 'react';
import { fireEvent, waitFor, screen, cleanup } from '@testing-library/react';
import {
	VirtualList as EmotionVirtualList,
	virtualListScrollContainerTestId,
} from '../../../../components/picker/VirtualList';
import { VirtualList as CompiledVirtualList } from '../../../../components/compiled/picker/VirtualList';
import { renderWithIntl } from '../../_testing-library';

// cleanup `platform_editor_css_migrate_emoji` - delete emotion duplicate & can remove '- compiled' below
describe('VirtualList - compiled', () => {
	const onRowsRendered = jest.fn();

	const renderList = () => {
		return renderWithIntl(
			<CompiledVirtualList
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

describe('VirtualList - emotion', () => {
	const onRowsRendered = jest.fn();

	const renderList = () => {
		return renderWithIntl(
			<EmotionVirtualList
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
