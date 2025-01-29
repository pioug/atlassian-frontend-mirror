jest.mock('unzipit', () => ({
	unzip: () => {
		return {
			archive: 'file',
			entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
		};
	},
	HTTPRangeReader: () => 'reader',
}));
jest.unmock('../../../../../utils');
import { IntlProvider } from 'react-intl-next';

import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import {
	ArchiveSidebar,
	type ArchiveSidebarProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar';
import { type ZipEntry } from 'unzipit';

describe('ArchiveSidebar', () => {
	const mediaClient = fakeMediaClient();

	function mountBaseComponent(props: Partial<ArchiveSidebarProps>) {
		const baseProps = {
			entries: {},
			onEntrySelected: () => {},
			onHeaderClicked: () => {},
			mediaClient: mediaClient,
			isArchiveEntryLoading: false,
			onError: () => {},
			shouldRenderAbuseModal: false,
		};
		const passedProps = { ...baseProps, ...props };
		return render(
			<IntlProvider locale="eng">
				<ArchiveSidebar {...passedProps} />
			</IntlProvider>,
		);
	}

	it('should set root using passed in entry', async () => {
		const entry = {
			name: 'folder1',
			isDirectory: true,
		} as ZipEntry;

		const onEntrySelectedMock = jest.fn();
		mountBaseComponent({ onEntrySelected: onEntrySelectedMock, entries: { entry } });
		expect(screen.getByText('folder1')).toBeInTheDocument();
	});

	it('should show correct entry name when entry is selected', async () => {
		const entry = {
			name: 'archive.zip',
			isDirectory: false,
			blob: jest.fn(),
		} as any;

		const onEntrySelectedMock = jest.fn();
		mountBaseComponent({ onEntrySelected: onEntrySelectedMock, entries: { entry } });
		expect(screen.getByText('archive.zip')).toBeInTheDocument();
	});

	it('should not call onEntrySelected if entry is directory', async () => {
		const entry = {
			name: 'folder_1',
			isDirectory: true,
			blob: jest.fn(),
		} as any;

		const onEntrySelectedMock = jest.fn();
		mountBaseComponent({ onEntrySelected: onEntrySelectedMock, entries: { entry } });
		const entryItem = screen.getByText('folder_1');
		fireEvent.click(entryItem);
		expect(onEntrySelectedMock).toHaveBeenCalledTimes(0);
	});

	it('ArchiveSidebarHeaders onHeaderClicked callback should be triggered when header is clicked', async () => {
		const entry = {
			name: 'root/archive.zip',
			isDirectory: false,
			blob: jest.fn(),
		} as any;
		const onEntrySelectedMock = jest.fn();
		const onHeaderClickedMock = jest.fn();
		mountBaseComponent({
			onHeaderClicked: onHeaderClickedMock,
			onEntrySelected: onEntrySelectedMock,
			entries: { entry },
		});
		const headerBtn = screen.getByLabelText('Home');
		fireEvent.click(headerBtn);
		expect(onHeaderClickedMock).toHaveBeenCalled();
		expect(screen.getByText('root/')).toBeInTheDocument();
	});

	it('should call onError if rejectAfter throws an error', async () => {
		const entry = {
			name: 'archive.zip',
			isDirectory: false,
			blob: jest.fn().mockImplementation(() => {
				throw new Error('error');
			}),
		} as any;

		const onErrorMock = jest.fn();
		const onEntrySelectedMock = jest.fn();
		mountBaseComponent({
			onEntrySelected: onEntrySelectedMock,
			onError: onErrorMock,
			entries: { entry },
		});
		const downloadBtn = screen.getByLabelText('Download');
		fireEvent.click(downloadBtn);
		await waitFor(() => {
			expect(onErrorMock).toHaveBeenCalledWith(new Error('error'), entry);
		});
	});
});
