import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	ArchiveSidebarFolderEntry,
	type ArchiveSidebarFolderProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-folder-entry';
import { fakeMediaClient, getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { type ZipEntry } from 'unzipit';
import { IntlProvider } from 'react-intl-next';
import * as MediaCommon from '@atlaskit/media-common';

jest.spyOn(MediaCommon, 'downloadUrl');

afterEach(() => {
	jest.resetAllMocks();
});

describe('ArchiveSidebarFolderEntry', () => {
	const baseProps: ArchiveSidebarFolderProps = {
		root: '',
		entries: {},
		mediaClient: fakeMediaClient(),
		onEntrySelected: () => {},
		isArchiveEntryLoading: false,
		onError: () => {},
		shouldRenderAbuseModal: false,
	};

	const ArchiveSidebarFolderEntryWithIntl = (props: ArchiveSidebarFolderProps) => (
		<IntlProvider locale="eng">
			<ArchiveSidebarFolderEntry {...props} />
		</IntlProvider>
	);

	it('should render ArchiveSidebarFolderWrapper but not ButtonItem element if no entries', async () => {
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} />);
		const folderWrapper = await screen.findByTestId('archive-sidebar-folder-wrapper');
		expect(folderWrapper).toBeInTheDocument();
		expect(folderWrapper.children).toHaveLength(0);
	});

	it('should render Item and not DownloadIcon element if entry is directory', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'folder1',
					isDirectory: true,
				} as ZipEntry,
			},
			root: '',
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const folder1 = await screen.findByText('folder1');
		expect(folder1).toBeInTheDocument();

		const downloadIcon = screen.queryByLabelText('Download');
		expect(downloadIcon).not.toBeInTheDocument();
	});

	it('should render DownloadIcon element if entry is not directory', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'file1',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const downloadIcon = await screen.findByLabelText('Download');
		expect(downloadIcon).toBeInTheDocument();
	});

	it('should render Folder24Icon and not MediaTypeIcon if entry is directory', () => {
		const props = {
			entries: {
				folder1: {
					name: 'folder1',
					isDirectory: true,
				} as ZipEntry,
			},
			root: '',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const folderIcon = document.querySelector('[aria-label=Folder]');
		expect(folderIcon).toBeInTheDocument();
	});

	it('should render MediaTypeIcon and not Folder24Icon if entry is not directory', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'file1.mp4',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const typeIcon = await screen.findByTestId('file-type-icon');
		expect(typeIcon).toBeInTheDocument();
		expect(typeIcon.getAttribute('data-type')).toBe('video');
	});

	it('should render Item as many times as entries are given', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'folder1',
					isDirectory: true,
				} as ZipEntry,
				folder2: {
					name: 'folder2',
					isDirectory: true,
				} as ZipEntry,
				file1: {
					name: 'file1.png',
					isDirectory: false,
				} as ZipEntry,
				file2: {
					name: 'file2.mp4',
					isDirectory: false,
				} as ZipEntry,
				file3: {
					name: 'file3',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const folder1 = await screen.findByText('folder1');
		expect(folder1).toBeInTheDocument();
		const folder2 = await screen.findByText('folder2');
		expect(folder2).toBeInTheDocument();

		const folderIcons = document.querySelectorAll('[aria-label=Folder]');
		expect(folderIcons).toHaveLength(2);

		const file1 = await screen.findByText('file1.png');
		expect(file1).toBeInTheDocument();

		const file2 = await screen.findByText('file2.mp4');
		expect(file2).toBeInTheDocument();

		const typeIcons = await screen.findAllByTestId('file-type-icon');
		expect(typeIcons).toHaveLength(3);

		const downloadIcons = await screen.findAllByLabelText('Download');
		expect(downloadIcons).toHaveLength(3);

		const folderWrapper = await screen.findByTestId('archive-sidebar-folder-wrapper');
		expect(folderWrapper).toBeInTheDocument();
	});

	it('should render Items when all root directory entry is not available', async () => {
		const props = {
			entries: {
				file1: {
					name: 'folder1/file1',
					isDirectory: false,
				} as ZipEntry,
				file2: {
					name: 'folder1/file2',
					isDirectory: false,
				} as ZipEntry,
				file3: {
					name: 'folder2/file3',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const folder1 = await screen.findByText('folder1/');
		expect(folder1).toBeInTheDocument();
		const folder2 = await screen.findByText('folder2/');
		expect(folder2).toBeInTheDocument();

		const folderIcons = document.querySelectorAll('[aria-label=Folder]');
		expect(folderIcons).toHaveLength(2);

		const folderWrapper = await screen.findByTestId('archive-sidebar-folder-wrapper');
		expect(folderWrapper).toBeInTheDocument();
	});

	it('should render Items when all root directory entry is not available and only one file is under the root', async () => {
		const props = {
			entries: {
				file1: {
					name: 'folder1/file1',
					isDirectory: false,
				} as ZipEntry,
				file2: {
					name: 'folder1/file2',
					isDirectory: false,
				} as ZipEntry,
				file3: {
					name: 'file3.pdf',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const folder1 = await screen.findByText('folder1/');
		expect(folder1).toBeInTheDocument();
		const file3 = await screen.findByText('file3.pdf');
		expect(file3).toBeInTheDocument();

		const typeIcon = await screen.findByTestId('file-type-icon');
		expect(typeIcon).toBeInTheDocument();
		expect(typeIcon.getAttribute('data-type')).toBe('doc');

		const downloadIcon = await screen.findByLabelText('Download');
		expect(downloadIcon).toBeInTheDocument();
		expect(downloadIcon.getAttribute('role')).toBe('img');

		const folderWrapper = await screen.findByTestId('archive-sidebar-folder-wrapper');
		expect(folderWrapper).toBeInTheDocument();
	});

	it('should render Items when some root directory entres are not available', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'folder1/',
					isDirectory: true,
				} as ZipEntry,
				file1: {
					name: 'folder1/file1',
					isDirectory: false,
				} as ZipEntry,
				file2: {
					name: 'folder2/file2',
					isDirectory: false,
				} as ZipEntry,
				file3: {
					name: 'file3.docx',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const folder1 = await screen.findByText('folder1/');
		expect(folder1).toBeInTheDocument();
		const folder2 = await screen.findByText('folder2/');
		expect(folder2).toBeInTheDocument();
		const file3 = await screen.findByText('file3.docx');
		expect(file3).toBeInTheDocument();

		const typeIcon = await screen.findByTestId('file-type-icon');
		expect(typeIcon).toBeInTheDocument();
		expect(typeIcon.getAttribute('data-type')).toBe('doc');

		const downloadIcon = await screen.findByLabelText('Download');
		expect(downloadIcon).toBeInTheDocument();
		expect(downloadIcon.getAttribute('role')).toBe('img');

		const folderWrapper = await screen.findByTestId('archive-sidebar-folder-wrapper');
		expect(folderWrapper).toBeInTheDocument();
	});

	it('should render Items when some entries are private files', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'folder1/',
					isDirectory: true,
				} as ZipEntry,
				file1: {
					name: 'folder1/file1',
					isDirectory: false,
				} as ZipEntry,
				file2: {
					name: '__MACOSX/file2',
					isDirectory: false,
				} as ZipEntry,
				file3: {
					name: 'file3.pdf',
					isDirectory: false,
				} as ZipEntry,
				file4: {
					name: '.DS_Store',
					isDirectory: false,
				} as ZipEntry,
			},
			root: '',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const folder1 = await screen.findByText('folder1/');
		expect(folder1).toBeInTheDocument();
		const file3 = await screen.findByText('file3.pdf');
		expect(file3).toBeInTheDocument();

		const typeIcon = await screen.findByTestId('file-type-icon');
		expect(typeIcon).toBeInTheDocument();
		expect(typeIcon.getAttribute('data-type')).toBe('doc');
		const downloadIcon = await screen.findByLabelText('Download');
		expect(downloadIcon).toBeInTheDocument();
		expect(downloadIcon.getAttribute('role')).toBe('img');
		const folderWrapper = await screen.findByTestId('archive-sidebar-folder-wrapper');
		expect(folderWrapper).toBeInTheDocument();
	});

	it('should render Items when root is one level deeper', async () => {
		const props = {
			entries: {
				folder1: {
					name: 'folder1/',
					isDirectory: true,
				} as ZipEntry,
				file1: {
					name: 'folder1/file1.jpg',
					isDirectory: false,
				} as ZipEntry,
				file2: {
					name: 'file2',
					isDirectory: false,
				} as ZipEntry,
			},
			root: 'folder1/',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const file1 = await screen.findByText('file1.jpg');
		expect(file1).toBeInTheDocument();
		const typeIcon = await screen.findByTestId('file-type-icon');
		expect(typeIcon).toBeInTheDocument();
		expect(typeIcon.getAttribute('data-type')).toBe('image');
		const downloadIcon = await screen.findByLabelText('Download');
		expect(downloadIcon).toBeInTheDocument();
		expect(downloadIcon.getAttribute('role')).toBe('img');
	});

	it('Item should be called with file name as text prop', async () => {
		const props = {
			entries: {
				entry1: {
					name: 'root/entry1.jpg',
					isDirectory: false,
				} as ZipEntry,
			},
			root: 'root/',
		};
		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const button = await screen.findByText('entry1.jpg');
		expect(button).toBeInTheDocument();
	});

	it('Clicking downloadButtonWrapper should call downloadUrl', async () => {
		const user = userEvent.setup();
		const entry = {
			name: 'root/entry1.jpg',
			isDirectory: false,
			blob: jest.fn().mockReturnValue(''),
		} as unknown as ZipEntry;

		const props: Partial<ArchiveSidebarFolderProps> = {
			entries: {
				entry,
			} as any,
			root: 'root/',
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const downloadButtonWrapper = await screen.findByTestId('media-archiveDownloadButton');
		expect(downloadButtonWrapper).toBeInTheDocument();
		await user.click(downloadButtonWrapper);
		await waitFor(() => expect(MediaCommon.downloadUrl).toHaveBeenCalled());
	});

	it('Clicking downloadButtonWrapper should open abuse modal if shouldRenderAbuseModal = true', async () => {
		const user = userEvent.setup();
		const entry = {
			name: 'root/entry1.jpg',
			isDirectory: false,
			blob: jest.fn().mockReturnValue(''),
		} as unknown as ZipEntry;

		const props: Partial<ArchiveSidebarFolderProps> = {
			entries: {
				entry,
			} as any,
			root: 'root/',
			shouldRenderAbuseModal: true,
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const downloadButtonWrapper = await screen.findByTestId('media-archiveDownloadButton');
		expect(downloadButtonWrapper).toBeInTheDocument();
		await user.click(downloadButtonWrapper);

		const warningMsg = await screen.findByTestId('mediaAbuseModal');
		expect(warningMsg).toBeInTheDocument();

		const proceed = await screen.findByText('Proceed with download');
		await user.click(proceed);

		await waitFor(() => expect(MediaCommon.downloadUrl).toHaveBeenCalled());
	});

	it('should close abuse modal when cancel', async () => {
		const user = userEvent.setup();
		const entry = {
			name: 'root/entry1.jpg',
			isDirectory: false,
			blob: jest.fn().mockReturnValue(''),
		} as unknown as ZipEntry;

		const props: Partial<ArchiveSidebarFolderProps> = {
			entries: {
				entry,
			} as any,
			root: 'root/',
			shouldRenderAbuseModal: true,
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);
		const downloadButtonWrapper = await screen.findByTestId('media-archiveDownloadButton');
		expect(downloadButtonWrapper).toBeInTheDocument();
		await user.click(downloadButtonWrapper);

		const warningMsg = await screen.findByTestId('mediaAbuseModal');
		expect(warningMsg).toBeInTheDocument();

		const cancel = await screen.findByText('Cancel');
		await user.click(cancel);

		expect(MediaCommon.downloadUrl).not.toHaveBeenCalled();
	});

	it('disabledArchiveDownloadButton should be rendered if DSP is enforced', async () => {
		const user = userEvent.setup();
		const entry = {
			name: 'root/entry1.jpg',
			isDirectory: false,
			blob: jest.fn().mockReturnValue(''),
		} as unknown as ZipEntry;

		const props: Partial<ArchiveSidebarFolderProps> = {
			entries: {
				entry,
			} as any,
			root: 'root/',
		};

		const mediaClient = fakeMediaClient({
			...getDefaultMediaClientConfig(),
			enforceDataSecurityPolicy: true,
		});

		render(
			<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} mediaClient={mediaClient} />,
		);
		const downloadButtonWrapper = await screen.findByTestId('media-disabledArchiveDownloadButton');
		expect(downloadButtonWrapper).toBeInTheDocument();
		await user.click(downloadButtonWrapper);
		expect(MediaCommon.downloadUrl).not.toHaveBeenCalled();
	});

	it('should call onError if rejectAfter throws an error', async () => {
		const user = userEvent.setup();
		const entry = {
			name: 'root/entry1.jpg',
			isDirectory: false,
			blob: jest.fn().mockImplementation(() => {
				throw new Error();
			}),
		} as unknown as ZipEntry;
		const onErrorMock = jest.fn();
		const props: Partial<ArchiveSidebarFolderProps> = {
			entries: {
				entry,
			} as any,
			root: 'root/',
			onError: onErrorMock,
		};

		render(<ArchiveSidebarFolderEntryWithIntl {...baseProps} {...props} />);

		const downloadButtonWrapper = await screen.findByTestId('media-archiveDownloadButton');
		expect(downloadButtonWrapper).toBeInTheDocument();
		await user.click(downloadButtonWrapper);
		expect(onErrorMock).toHaveBeenCalledWith(new Error(), entry);
		expect(MediaCommon.downloadUrl).toHaveBeenCalledTimes(0);
	});
});
