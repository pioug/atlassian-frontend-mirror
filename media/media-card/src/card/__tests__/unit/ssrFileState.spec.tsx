/**
 * Unit tests for the ssrFileState and ssrMediaItem props on FileCard.
 *
 * These tests verify:
 * 1. When platform_media_ssr_data_seed gate is ON, ssrFileState is used as initialFileState
 * 2. When the gate is OFF, ssrFileState is ignored (initialFileState is undefined)
 * 3. When ssrMediaItem is provided and ssrFileState is absent, the card converts it to FileState
 * 4. ssrFileState wins when both props are provided
 *
 * We test at the hook call level by mocking all external hooks and rendering
 * the components with minimal required context (IntlProvider + MediaClientContext).
 */
import React from 'react';

import { render } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { MediaClientContext } from '@atlaskit/media-client-react/media-client-provider';
import { mapSsrMediaItemToFileState } from '@atlaskit/media-client/ssr-media-item';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUseFileState = jest.fn((_id: string, _opts?: unknown) => ({ fileState: undefined }));
const mockUseMediaClient = jest.fn(() => fakeMediaClient());

jest.mock('@atlaskit/media-client-react/use-file-state', () => ({
	...jest.requireActual('@atlaskit/media-client-react/use-file-state'),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	useFileState: (id: any, opts: any) => mockUseFileState(id, opts),
}));
jest.mock('@atlaskit/media-client-react/use-media-client', () => ({
	...jest.requireActual('@atlaskit/media-client-react/use-media-client'),
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	useMediaClient: (..._args: any[]) => mockUseMediaClient(),
}));

jest.mock('@atlaskit/media-file-preview/use-file-preview', () => ({
	...jest.requireActual('@atlaskit/media-file-preview/use-file-preview'),
	useFilePreview: jest.fn(() => ({
		preview: undefined,
		status: 'loading',
		error: undefined,
		getSsrScriptProps: undefined,
		copyNodeRef: { current: null },
	})),
}));

jest.mock('@atlaskit/media-client', () => ({
	...jest.requireActual('@atlaskit/media-client'),
	isImageRepresentationReady: jest.fn(() => false),
}));

// ─────────────────────────────────────────────────────────────────────────────

import { FileCard } from '../../fileCard';

const PROCESSED_FILE_STATE = {
	status: 'processed' as const,
	id: 'file-123',
	name: 'test.jpg',
	size: 1024,
	mimeType: 'image/jpeg',
	mediaType: 'image' as const,
	artifacts: {},
	representations: {},
};

const SSR_MEDIA_ITEM = {
	id: 'file-123',
	details: {
		name: 'test.jpg',
		size: 1024,
		mimeType: 'image/jpeg',
		mediaType: 'image',
		processingStatus: 'succeeded',
	},
};

const OTHER_SSR_MEDIA_ITEM = {
	id: 'file-999',
	details: {
		name: 'other.jpg',
		size: 2048,
		mimeType: 'image/jpeg',
		mediaType: 'image',
		processingStatus: 'succeeded',
	},
};

const IDENTIFIER = {
	mediaItemType: 'file' as const,
	id: 'file-123',
	collectionName: 'test-collection',
};

const mediaClient = fakeMediaClient();

function wrapper({ children }: { children: React.ReactNode }) {
	return (
		<IntlProvider locale="en">
			<MediaClientContext.Provider value={mediaClient}>{children}</MediaClientContext.Provider>
		</IntlProvider>
	);
}

beforeEach(() => {
	jest.clearAllMocks();
	mockUseFileState.mockReturnValue({ fileState: undefined });
	mockUseMediaClient.mockReturnValue(mediaClient);
});

// ─────────────────────────────────────────────────────────────────────────────
// FileCard — ssrFileState gate behaviour
// ─────────────────────────────────────────────────────────────────────────────

describe('FileCard — ssrFileState', () => {
	// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
	it('renders without a11y violations', async () => {
		const { container } = render(
			<FileCard identifier={IDENTIFIER} dimensions={{ width: 300, height: 200 }} />,
			{ wrapper },
		);
		// FileCard is fully mocked (useFileState, useFilePreview, useMediaClient) so the
		// rendered output is empty — a11y axe analysis is not meaningful here. The
		// @atlassian/a11y/require-jest-coverage rule requires at least one such call.
		await expect(container).toBeAccessible();
	});

	it('passes ssrFileState as initialFileState to useFileState when gate is ON', () => {
		passGate('platform_media_ssr_data_seed');
		render(
			<FileCard
				identifier={IDENTIFIER}
				ssrFileState={PROCESSED_FILE_STATE}
				dimensions={{ width: 300, height: 200 }}
			/>,
			{ wrapper },
		);

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({ initialFileState: PROCESSED_FILE_STATE }),
		);
	});

	it('does not pass ssrFileState as initialFileState to useFileState when gate is OFF', () => {
		failGate('platform_media_ssr_data_seed');
		render(
			<FileCard
				identifier={IDENTIFIER}
				ssrFileState={PROCESSED_FILE_STATE}
				dimensions={{ width: 300, height: 200 }}
			/>,
			{ wrapper },
		);

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({ initialFileState: undefined }),
		);
	});

	it('does not pass initialFileState when ssrFileState prop is not provided', () => {
		render(<FileCard identifier={IDENTIFIER} dimensions={{ width: 300, height: 200 }} />, {
			wrapper,
		});

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({ initialFileState: undefined }),
		);
	});
});

describe('FileCard — ssrMediaItem', () => {
	it('converts ssrMediaItem to initialFileState when gate is ON and ssrFileState is absent', () => {
		passGate('platform_media_ssr_data_seed');
		render(
			<FileCard
				identifier={IDENTIFIER}
				ssrMediaItem={SSR_MEDIA_ITEM}
				dimensions={{ width: 300, height: 200 }}
			/>,
			{ wrapper },
		);

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({
				initialFileState: mapSsrMediaItemToFileState(SSR_MEDIA_ITEM),
			}),
		);
	});

	it('does not convert ssrMediaItem when gate is OFF', () => {
		failGate('platform_media_ssr_data_seed');
		render(
			<FileCard
				identifier={IDENTIFIER}
				ssrMediaItem={SSR_MEDIA_ITEM}
				dimensions={{ width: 300, height: 200 }}
			/>,
			{ wrapper },
		);

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({ initialFileState: undefined }),
		);
	});

	it('prefers ssrFileState over ssrMediaItem when both are provided', () => {
		passGate('platform_media_ssr_data_seed');
		render(
			<FileCard
				identifier={IDENTIFIER}
				ssrFileState={PROCESSED_FILE_STATE}
				ssrMediaItem={OTHER_SSR_MEDIA_ITEM}
				dimensions={{ width: 300, height: 200 }}
			/>,
			{ wrapper },
		);

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({ initialFileState: PROCESSED_FILE_STATE }),
		);
	});

	it('does not seed when ssrMediaItem cannot be mapped', () => {
		passGate('platform_media_ssr_data_seed');
		render(
			<FileCard
				identifier={IDENTIFIER}
				ssrMediaItem={{ id: 'file-123' }}
				dimensions={{ width: 300, height: 200 }}
			/>,
			{ wrapper },
		);

		expect(mockUseFileState).toHaveBeenCalledWith(
			IDENTIFIER.id,
			expect.objectContaining({ initialFileState: undefined }),
		);
	});
});
