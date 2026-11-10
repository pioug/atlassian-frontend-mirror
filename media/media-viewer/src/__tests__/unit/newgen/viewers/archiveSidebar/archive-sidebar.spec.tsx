jest.mock('unzipit', () => ({
	unzip: () => {
		return {
			archive: 'file',
			entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
		};
	},
	HTTPRangeReader: () => 'reader',
}));
import React from 'react';

import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { type ZipEntry } from 'unzipit';

import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import {
	ArchiveSidebar,
	type ArchiveSidebarProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar';
import * as FolderEntryModule from '../../../../../viewers/archiveSidebar/archive-sidebar-folder-entry';
import * as HeaderModule from '../../../../../viewers/archiveSidebar/archive-sidebar-header';
import * as SeparatorModule from '../../../../../viewers/archiveSidebar/separator';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ArchiveSidebar', () => {
	const mediaClient = fakeMediaClient();

	const OriginalArchiveSidebarHeader = HeaderModule.ArchiveSidebarHeader;
	const OriginalArchiveSidebarFolderEntry = FolderEntryModule.ArchiveSidebarFolderEntry;

	beforeEach(() => {
		jest.spyOn(SeparatorModule, 'Separator');
		// ArchiveSidebarHeader is a class, so the spy renders the original rather than calling it.
		jest
			.spyOn(HeaderModule, 'ArchiveSidebarHeader')
			.mockImplementation(((props: HeaderModule.HeaderProps) => (
				<OriginalArchiveSidebarHeader {...props} />
			)) as unknown as () => HeaderModule.ArchiveSidebarHeader);
		// ArchiveSidebarFolderEntry is a forwardRef object, not a function, so the spy is on the export's
		// getter and returns a function component that renders the original. Jest's types only allow
		// getter spies on non-callable properties, hence the cast.
		jest
			.spyOn(
				FolderEntryModule as unknown as Record<'ArchiveSidebarFolderEntry', object>,
				'ArchiveSidebarFolderEntry',
				'get',
			)
			.mockReturnValue(
				jest.fn((props: FolderEntryModule.ArchiveSidebarFolderProps) => (
					<OriginalArchiveSidebarFolderEntry {...props} />
				)),
			);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	function mountBaseComponent(props: Partial<ArchiveSidebarProps>, isInsetViewer = false) {
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
				<InsetViewerProvider isInsetViewer={isInsetViewer}>
					<ArchiveSidebar {...passedProps} />
				</InsetViewerProvider>
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

	it('should render the header and separator, and no heading or selectedEntryName, when not inset', () => {
		const entry = { name: 'file.txt', isDirectory: false } as ZipEntry;
		mountBaseComponent({ entries: { entry } });
		fireEvent.click(screen.getByText('file.txt'));

		expect(HeaderModule.ArchiveSidebarHeader).toHaveBeenCalled();
		expect(SeparatorModule.Separator).toHaveBeenCalled();
		expect(screen.queryByText('Attachments in this zip file')).not.toBeInTheDocument();
		expect(FolderEntryModule.ArchiveSidebarFolderEntry).toHaveBeenLastCalledWith(
			expect.objectContaining({ selectedEntryName: undefined }),
			expect.anything(),
		);
	});

	describe('in the inset viewer', () => {
		const folder = { name: 'folder1', isDirectory: true } as ZipEntry;
		const file = { name: 'file.txt', isDirectory: false } as ZipEntry;

		it('should always show the heading, show the Back row only inside a folder, and never a separator', async () => {
			const onHeaderClicked = jest.fn();
			mountBaseComponent({ entries: { folder, file }, onHeaderClicked }, true);

			expect(screen.getByRole('heading', { name: 'Attachments in this zip file' })).toBeVisible();
			expect(HeaderModule.ArchiveSidebarHeader).not.toHaveBeenCalled();

			fireEvent.click(screen.getByText('folder1'));
			await waitFor(() => {
				expect(HeaderModule.ArchiveSidebarHeader).toHaveBeenCalledWith(
					expect.objectContaining({ folderName: 'folder1' }),
					expect.anything(),
				);
			});
			expect(screen.getByRole('heading', { name: 'Attachments in this zip file' })).toBeVisible();

			fireEvent.click(screen.getByLabelText('Back'));
			expect(onHeaderClicked).toHaveBeenCalledTimes(1);
			await waitFor(() => {
				expect(screen.queryByLabelText('Back')).not.toBeInTheDocument();
			});
			expect(screen.getByRole('heading', { name: 'Attachments in this zip file' })).toBeVisible();
			expect(SeparatorModule.Separator).not.toHaveBeenCalled();
		});

		it('should pass the picked file as selectedEntryName straight away', async () => {
			const onEntrySelected = jest.fn();
			mountBaseComponent({ entries: { folder, file }, onEntrySelected }, true);
			expect(FolderEntryModule.ArchiveSidebarFolderEntry).toHaveBeenLastCalledWith(
				expect.objectContaining({ selectedEntryName: undefined }),
				expect.anything(),
			);

			fireEvent.click(screen.getByText('file.txt'));

			expect(onEntrySelected).toHaveBeenCalledWith(file);
			await waitFor(() => {
				expect(FolderEntryModule.ArchiveSidebarFolderEntry).toHaveBeenLastCalledWith(
					expect.objectContaining({ selectedEntryName: 'file.txt' }),
					expect.anything(),
				);
			});
		});

		it('should be accessible', async () => {
			mountBaseComponent({ entries: { file } }, true);
			await expect(document.body).toBeAccessible();
		});
	});
});
