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
import { type ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient, sleep } from '@atlaskit/media-test-helpers';

jest.mock('unzipit', () => ({
	unzip: () => {
		return {
			archive: 'file',
			entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
		};
	},
	HTTPRangeReader: function () {
		return 'reader';
	},
}));

import {
	ArchiveViewerBase,
	type Props as ArchiveViewerProps,
} from '../../../../../viewers/archiveSidebar/archive';
import { ArchiveLayout } from '../../../../../viewers/archiveSidebar/styleWrappers';
import { InteractiveImg } from '../../../../../viewers/image/interactive-img';
import ArchiveSidebarRenderer from '../../../../../viewers/archiveSidebar/archive-sidebar-renderer';
import { shallow } from 'enzyme';

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

	function mountComponent(passedProps: Partial<ArchiveViewerProps>) {
		const baseProps = {
			mediaClient: mediaClient,
			item: fileState,
			collectionName: collectionName,
			onError: () => {},
			onSuccess: () => {},
		};
		const props = { ...baseProps, ...passedProps };
		return shallow(<ArchiveViewerBase viewerOptions={viewerOptions} {...props} />);
	}

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should have ArchiveLayout element', () => {
		const el = mountComponent({});
		expect(el.find(ArchiveLayout)).toHaveLength(1);
	});
	it('should render ArchiveSidebarRenderer', () => {
		const el = mountComponent({});
		expect(el.find(ArchiveSidebarRenderer)).toHaveLength(1);
	});
	it('ArchiveSidebarRenderer should change selected entry and render InteractiveImg', async () => {
		await Loadable.preloadAll();
		const el = mountComponent({});
		const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
		archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
			isDirectory: false,
			name: 'file_a.jpeg',
			src: 'src',
			blob: jest.fn(),
		} as any);
		await sleep(0);
		expect(el.find(InteractiveImg)).toHaveLength(1);
		expect(shouldUseCustomRenderer).toHaveBeenCalledTimes(1);
	});
	it('ArchiveSidebarRenderer should change selected entry and use custom renderer', async () => {
		shouldUseCustomRenderer.mockReturnValue(true);
		const el = mountComponent({});
		const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
		archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
			isDirectory: false,
			name: 'file_a.jpeg',
			src: 'src',
			blob: jest.fn(),
		} as any);
		await sleep(0);
		const customContent = el.find('[data-testid="custom-renderer"]');
		expect(customContent).toHaveLength(1);
		expect(customContent.text()).toEqual('file_a.jpeg');
		expect(renderContent).toHaveBeenCalledTimes(1);
		expect(renderContent).toHaveBeenLastCalledWith(
			expect.objectContaining({ fileItem: fileState, archiveFileItem: { name: 'file_a.jpeg' } }),
		);
		expect(shouldUseCustomRenderer).toHaveBeenCalledTimes(1);
	});
});
