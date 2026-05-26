import type { CustomRendererProps, ViewerOptionsProps } from '@atlaskit/media-viewer';
import Loadable from 'react-loadable';

jest.mock('../../../../../analytics/events/operational/zipEntryLoadSucceeded', () => ({
	createZipEntryLoadSucceededEvent: jest.fn(),
}));
jest.mock('../../../../../analytics/events/operational/zipEntryLoadFailed', () => ({
	createZipEntryLoadFailedEvent: jest.fn(),
}));

jest.mock('@atlaskit/media-client', () => {
	const actualModule = jest.requireActual('@atlaskit/media-client');
	return {
		...actualModule,
		request: jest.fn().mockResolvedValue({
			text: jest.fn().mockResolvedValue('some-src'),
			arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
		}),
	};
});

import React from 'react';
import { render, screen, userEvent } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { type ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

jest.mock('unzipit', () => ({
	unzip: () => ({
		archive: 'file',
		entries: {
			'file_a.jpeg': {
				name: 'file_a.jpeg',
				isDirectory: false,
				blob: jest.fn().mockResolvedValue(new Blob(['some-data'], { type: 'image/jpeg' })),
			},
		},
	}),
	HTTPRangeReader: function () {
		return 'reader';
	},
}));

import {
	ArchiveViewerBase,
	type Props as ArchiveViewerProps,
} from '../../../../../viewers/archiveSidebar/archive';

describe('Archive with custom renderer', () => {
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

	const shouldUseCustomRenderer = jest.fn(() => false);

	const renderContent = jest.fn((props: CustomRendererProps): React.ReactNode => {
		return <div data-testid="custom-renderer">{props.archiveFileItem?.name}</div>;
	});

	const viewerOptions: ViewerOptionsProps = {
		customRenderers: [{ shouldUseCustomRenderer, renderContent }],
	};

	const renderComponent = (passedProps: Partial<ArchiveViewerProps> = {}) => {
		const baseProps = {
			mediaClient,
			item: fileState,
			collectionName,
			onError: () => {},
			onSuccess: () => {},
			traceContext: { traceId: 'some-trace-id' },
		};
		const props = { ...baseProps, ...passedProps };
		return render(
			<IntlProvider locale="en">
				<ArchiveViewerBase viewerOptions={viewerOptions} {...props} />
			</IntlProvider>,
		);
	};

	let originalCreateObjectURL: typeof URL.createObjectURL;
	let originalRevokeObjectURL: typeof URL.revokeObjectURL;

	beforeAll(() => {
		originalCreateObjectURL = URL.createObjectURL;
		originalRevokeObjectURL = URL.revokeObjectURL;
		URL.createObjectURL = jest.fn(() => 'blob:fake-url');
		URL.revokeObjectURL = jest.fn();
	});

	afterAll(() => {
		URL.createObjectURL = originalCreateObjectURL;
		URL.revokeObjectURL = originalRevokeObjectURL;
	});

	beforeEach(() => {
		jest.clearAllMocks();
		shouldUseCustomRenderer.mockReturnValue(false);
	});

	it('should render the archive sidebar (ArchiveLayout) on mount', async () => {
		renderComponent({});
		// Sidebar entry from the mocked archive becomes visible once unzip resolves
		expect(await screen.findByText('file_a.jpeg')).toBeInTheDocument();
	});

	it('should render ArchiveSidebarRenderer (with the home/root header)', async () => {
		renderComponent({});
		// Home header (root folder) is rendered by ArchiveSidebarRenderer's child sidebar
		expect(await screen.findByLabelText('Home')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render InteractiveImg when an image entry is selected (no custom renderer)', async () => {
		await Loadable.preloadAll();
		renderComponent({});
		const entryButton = await screen.findByText('file_a.jpeg');
		await userEvent.click(entryButton);

		expect(await screen.findByAltText('file_a.jpeg')).toBeInTheDocument();
		expect(shouldUseCustomRenderer).toHaveBeenCalledTimes(1);
	});

	it('should use the custom renderer when shouldUseCustomRenderer returns true', async () => {
		shouldUseCustomRenderer.mockReturnValue(true);
		renderComponent({});
		const entryButton = await screen.findByText('file_a.jpeg');
		await userEvent.click(entryButton);

		const customContent = await screen.findByTestId('custom-renderer');
		expect(customContent).toHaveTextContent('file_a.jpeg');
		expect(renderContent).toHaveBeenCalledTimes(1);
		expect(renderContent).toHaveBeenLastCalledWith(
			expect.objectContaining({
				fileItem: fileState,
				archiveFileItem: { name: 'file_a.jpeg' },
			}),
		);
		expect(shouldUseCustomRenderer).toHaveBeenCalledTimes(1);
	});
});
