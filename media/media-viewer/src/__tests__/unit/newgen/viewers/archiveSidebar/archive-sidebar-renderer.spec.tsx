jest.mock('unzipit', () => ({
	unzip: jest.fn().mockImplementation(() => {
		return {
			archive: 'file',
			entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
		};
	}),
	HTTPRangeReader: function () {
		return 'reader';
	},
}));

import React from 'react';
import { render, screen, waitFor, userEvent } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { type ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient, sleep } from '@atlaskit/media-test-helpers';
import ArchiveSidebarRenderer, {
	type ArchiveSidebarRendererProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-renderer';
import { unzip } from 'unzipit';

describe('ArchiveSidebarRenderer', () => {
	const fileState: ProcessedFileState = {
		id: 'some-id',
		status: 'processed',
		name: 'file',
		size: 11222,
		mediaType: 'archive',
		mimeType: 'zip',
		artifacts: {},
		representations: {
			image: {},
		},
	};
	const mediaClient = fakeMediaClient();
	const collectionName = 'some-collection';

	function renderBaseComponent(props: Partial<ArchiveSidebarRendererProps>) {
		const baseProps = {
			selectedFileState: fileState,
			mediaClient: mediaClient,
			onSelectedArchiveEntryChange: () => {},
			onHeaderClicked: () => {},
			isArchiveEntryLoading: false,
			collectionName: collectionName,
			onError: () => {},
			onSuccess: () => {},
		};
		const passedProps = { ...baseProps, ...props };
		return render(
			<IntlProvider locale="en">
				<ArchiveSidebarRenderer {...passedProps} />
			</IntlProvider>,
		);
	}

	beforeEach(() => {
		(unzip as jest.Mock).mockImplementation(() => ({
			archive: 'file',
			entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
		}));
	});

	it('should render Spinner while loading (ArchiveSideBar present)', () => {
		renderBaseComponent({});
		// While loading, Spinner is rendered inside ArchiveSideBar
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
	});

	it('should not render Spinner once status is loaded', async () => {
		renderBaseComponent({});
		await waitFor(() => {
			expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
		});
	});

	it('should render Spinner when status is loading', () => {
		renderBaseComponent({});
		// Initial render: status = 'loading'
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
	});

	it('should call onHeaderClicked when ArchiveSidebar header is clicked', async () => {
		const onHeaderClickedMock = jest.fn();
		renderBaseComponent({ onHeaderClicked: onHeaderClickedMock });
		// Wait for loading to finish; HomeIcon (root header) appears
		const homeButton = await screen.findByLabelText('Home');
		await userEvent.click(homeButton);
		expect(onHeaderClickedMock).toHaveBeenCalled();
	});

	// Note: prop-forwarding assertions on `isArchiveEntryLoading` couldn't be converted —
	// the prop has no observable DOM effect (folder entry never branches on it).
	it('should accept isArchiveEntryLoading prop without breaking the sidebar render', async () => {
		const { rerender } = renderBaseComponent({ isArchiveEntryLoading: true });
		expect(await screen.findByText('file_a.jpeg')).toBeInTheDocument();
		rerender(
			<IntlProvider locale="en">
				<ArchiveSidebarRenderer
					selectedFileState={fileState}
					mediaClient={mediaClient}
					onSelectedArchiveEntryChange={() => {}}
					onHeaderClicked={() => {}}
					isArchiveEntryLoading={false}
					collectionName={collectionName}
					onError={() => {}}
					onSuccess={() => {}}
				/>
			</IntlProvider>,
		);
		expect(await screen.findByText('file_a.jpeg')).toBeInTheDocument();
	});

	it('should call onSelectedArchiveEntryChange when an archive entry is clicked', async () => {
		const onSelectedArchiveEntryChangeMock = jest.fn();
		renderBaseComponent({
			isArchiveEntryLoading: false,
			onSelectedArchiveEntryChange: onSelectedArchiveEntryChangeMock,
		});
		const entryButton = await screen.findByText('file_a.jpeg');
		await userEvent.click(entryButton);
		expect(onSelectedArchiveEntryChangeMock).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'file_a.jpeg' }),
		);
	});

	it('should render every entry returned from unzip', async () => {
		(unzip as jest.Mock).mockImplementation(() => ({
			archive: 'file',
			entries: {
				'file_a.jpeg': { name: 'file_a.jpeg' },
				'file_b.png': { name: 'file_b.png' },
			},
		}));
		renderBaseComponent({});
		expect(await screen.findByText('file_a.jpeg')).toBeInTheDocument();
		expect(screen.getByText('file_b.png')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should call onError if unzip throws', async () => {
		const onErrorMock = jest.fn();
		(unzip as jest.Mock).mockImplementation(() => {
			throw new Error('some-error');
		});
		renderBaseComponent({ onError: onErrorMock });
		await sleep(0);
		await waitFor(() => {
			expect(onErrorMock).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'archiveviewer-read-binary' }),
			);
		});
	});
});
