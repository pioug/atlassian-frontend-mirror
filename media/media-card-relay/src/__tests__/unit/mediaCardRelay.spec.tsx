/**
 * Unit tests for MediaCardRelay and MediaInlineCardRelay.
 *
 * These tests verify:
 * 1. That useFragment is called with the correct fragment and ref
 * 2. That ssrFileState derived from fragment data is forwarded to Card/MediaInlineCard
 * 3. That null mediaItemRef results in undefined ssrFileState (no SSR seeding)
 * 4. That all other card props are passed through unchanged
 */
import React from 'react';

import { useFragment } from 'react-relay';

import { Card } from '@atlaskit/media-card';
import { MediaInlineCard } from '@atlaskit/media-card';
import { render } from '@atlassian/testing-library';

import { MediaCardRelay } from '../../mediaCardRelay';
import { MediaInlineCardRelay } from '../../mediaInlineCardRelay';
import { mapGQLItemsToFileState } from '../../utils/mapGQLItemsToFileState';

// ─── Mock react-relay ────────────────────────────────────────────────────────
// We mock useFragment so tests don't need a real Relay environment.
// The graphql tag mock returns a stable object so the fragment identity check passes.
jest.mock('react-relay', () => ({
	useFragment: jest.fn(),
	graphql: jest.fn((strings: TemplateStringsArray) => ({ kind: 'Fragment', name: strings[0] })),
}));

// ─── Mock @atlaskit/media-card ───────────────────────────────────────────────
jest.mock('@atlaskit/media-card', () => ({
	Card: jest.fn(({ testId }: { testId?: string }) => <div data-testid={testId ?? 'mock-card'} />),
	MediaInlineCard: jest.fn(({ testId }: { testId?: string }) => (
		<div data-testid={testId ?? 'mock-inline-card'} />
	)),
}));

// ─── Mock the GQL → FileState mapper ─────────────────────────────────────────
// The card components delegate the fragment → FileState transformation to this
// util; mocking it keeps these tests focused on the relay-wiring behaviour and
// leaves the mapping logic to its own dedicated unit tests.
jest.mock('../../utils/mapGQLItemsToFileState', () => ({
	mapGQLItemsToFileState: jest.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────

const mockUseFragment = useFragment as jest.Mock;
const mockMapGQLItemsToFileState = mapGQLItemsToFileState as jest.Mock;
const mockCard = Card as unknown as jest.Mock;
const mockMediaInlineCard = MediaInlineCard as unknown as jest.Mock;

const MOCK_FILE_ID = 'file-id-123';

const MOCK_MEDIA_ITEM = {
	id: MOCK_FILE_ID,
	type: 'file',
	details: {
		name: 'test-image.jpg',
		size: 204800,
		mimeType: 'image/jpeg',
		mediaType: 'image',
		processingStatus: 'succeeded',
		failReason: null,
		createdAt: 1700000000000,
		preview: { cdnUrl: 'https://cdn.example.com/preview.jpg' },
		representations: { image: { _empty: true } },
		mediaMetadata: { duration: null },
		abuseClassification: null,
	},
};

const MOCK_FILE_STATE = {
	status: 'processed',
	id: MOCK_FILE_ID,
	name: 'test-image.jpg',
	size: 204800,
	mimeType: 'image/jpeg',
	mediaType: 'image',
	artifacts: {},
	representations: {},
	preview: { value: 'https://cdn.example.com/preview.jpg' },
} as const;

const MOCK_IDENTIFIER = {
	mediaItemType: 'file' as const,
	id: MOCK_FILE_ID,
	collectionName: 'test-collection',
};

const MOCK_MEDIA_CLIENT_CONFIG = {
	authProvider: jest.fn(),
} as any;

beforeEach(() => {
	jest.clearAllMocks();
	mockMapGQLItemsToFileState.mockReturnValue(MOCK_FILE_STATE);
});

// ─────────────────────────────────────────────────────────────────────────────
// MediaCardRelay
// ─────────────────────────────────────────────────────────────────────────────
describe('MediaCardRelay', () => {
	it('renders accessibly with a valid ref', async () => {
		mockUseFragment.mockReturnValue(MOCK_MEDIA_ITEM);
		const { container } = render(
			<MediaCardRelay
				mediaItemRef={{ __id: MOCK_FILE_ID } as any}
				identifier={MOCK_IDENTIFIER}
				mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				testId="card"
			/>,
		);
		await expect(container).toBeAccessible();
	});

	describe('when mediaItemRef has valid fragment data', () => {
		beforeEach(() => {
			mockUseFragment.mockReturnValue(MOCK_MEDIA_ITEM);
		});

		it('calls mapGQLItemsToFileState with the fragment data', () => {
			const fakeRef = { __id: MOCK_FILE_ID } as any;

			render(
				<MediaCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
					testId="card"
				/>,
			);

			expect(mockMapGQLItemsToFileState).toHaveBeenCalledWith(MOCK_MEDIA_ITEM);
		});

		it('passes ssrFileState derived from fragment to Card', () => {
			const fakeRef = { __id: MOCK_FILE_ID } as any;

			render(
				<MediaCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssrFileState: MOCK_FILE_STATE }),
				expect.anything(),
			);
		});

		it('passes all other card props through to Card unchanged', () => {
			const fakeRef = { __id: MOCK_FILE_ID } as any;
			const dimensions = { width: 300, height: 200 };

			render(
				<MediaCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
					dimensions={dimensions}
					testId="my-card"
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({
					identifier: MOCK_IDENTIFIER,
					mediaClientConfig: MOCK_MEDIA_CLIENT_CONFIG,
					dimensions,
					testId: 'my-card',
				}),
				expect.anything(),
			);
		});
	});

	describe('when mediaItemRef is null', () => {
		beforeEach(() => {
			mockUseFragment.mockReturnValue(null);
			mockMapGQLItemsToFileState.mockReturnValue(undefined);
		});

		it('passes undefined ssrFileState to Card', () => {
			render(
				<MediaCardRelay
					mediaItemRef={null}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssrFileState: undefined }),
				expect.anything(),
			);
		});
	});

	describe('when mediaItemRef is undefined', () => {
		beforeEach(() => {
			mockUseFragment.mockReturnValue(null);
			mockMapGQLItemsToFileState.mockReturnValue(undefined);
		});

		it('passes undefined ssrFileState to Card', () => {
			render(
				<MediaCardRelay
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssrFileState: undefined }),
				expect.anything(),
			);
		});
	});

	describe('when mapGQLItemsToFileState returns undefined (e.g. partial fragment data)', () => {
		beforeEach(() => {
			mockUseFragment.mockReturnValue({ ...MOCK_MEDIA_ITEM, id: undefined });
			mockMapGQLItemsToFileState.mockReturnValue(undefined);
		});

		it('passes undefined ssrFileState to Card', () => {
			const fakeRef = { __id: 'x' } as any;

			render(
				<MediaCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssrFileState: undefined }),
				expect.anything(),
			);
		});
	});

	describe('ssr prop derivation', () => {
		it('derives ssr="server" when ssrFileState is present and caller did not pass ssr', () => {
			mockUseFragment.mockReturnValue(MOCK_MEDIA_ITEM);
			mockMapGQLItemsToFileState.mockReturnValue(MOCK_FILE_STATE);

			render(
				<MediaCardRelay
					mediaItemRef={{ __id: MOCK_FILE_ID } as any}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssr: 'server' }),
				expect.anything(),
			);
		});

		it('leaves ssr undefined when ssrFileState is undefined and caller did not pass ssr', () => {
			mockUseFragment.mockReturnValue(null);
			mockMapGQLItemsToFileState.mockReturnValue(undefined);

			render(
				<MediaCardRelay
					mediaItemRef={null}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssr: undefined }),
				expect.anything(),
			);
		});

		it('preserves caller-provided ssr even when ssrFileState is present', () => {
			mockUseFragment.mockReturnValue(MOCK_MEDIA_ITEM);
			mockMapGQLItemsToFileState.mockReturnValue(MOCK_FILE_STATE);

			render(
				<MediaCardRelay
					mediaItemRef={{ __id: MOCK_FILE_ID } as any}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
					ssr="client"
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssr: 'client' }),
				expect.anything(),
			);
		});

		it('preserves caller-provided ssr even when ssrFileState is undefined', () => {
			mockUseFragment.mockReturnValue(null);
			mockMapGQLItemsToFileState.mockReturnValue(undefined);

			render(
				<MediaCardRelay
					mediaItemRef={null}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
					ssr="server"
				/>,
			);

			expect(mockCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssr: 'server' }),
				expect.anything(),
			);
		});
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// MediaInlineCardRelay
// ─────────────────────────────────────────────────────────────────────────────
describe('MediaInlineCardRelay', () => {
	describe('when mediaItemRef has valid fragment data', () => {
		beforeEach(() => {
			mockUseFragment.mockReturnValue(MOCK_MEDIA_ITEM);
		});

		it('calls mapGQLItemsToFileState with the fragment data', () => {
			const fakeRef = { __id: MOCK_FILE_ID } as any;

			render(
				<MediaInlineCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockMapGQLItemsToFileState).toHaveBeenCalledWith(MOCK_MEDIA_ITEM);
		});

		it('passes ssrFileState derived from fragment to MediaInlineCard', () => {
			const fakeRef = { __id: MOCK_FILE_ID } as any;

			render(
				<MediaInlineCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockMediaInlineCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssrFileState: MOCK_FILE_STATE }),
				expect.anything(),
			);
		});

		it('passes all other props through to MediaInlineCard unchanged', () => {
			const fakeRef = { __id: MOCK_FILE_ID } as any;

			render(
				<MediaInlineCardRelay
					mediaItemRef={fakeRef}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
					shouldOpenMediaViewer
				/>,
			);

			expect(mockMediaInlineCard).toHaveBeenCalledWith(
				expect.objectContaining({
					identifier: MOCK_IDENTIFIER,
					mediaClientConfig: MOCK_MEDIA_CLIENT_CONFIG,
					shouldOpenMediaViewer: true,
				}),
				expect.anything(),
			);
		});
	});

	describe('when mediaItemRef is null', () => {
		beforeEach(() => {
			mockUseFragment.mockReturnValue(null);
			mockMapGQLItemsToFileState.mockReturnValue(undefined);
		});

		it('passes undefined ssrFileState to MediaInlineCard', () => {
			render(
				<MediaInlineCardRelay
					mediaItemRef={null}
					identifier={MOCK_IDENTIFIER}
					mediaClientConfig={MOCK_MEDIA_CLIENT_CONFIG}
				/>,
			);

			expect(mockMediaInlineCard).toHaveBeenCalledWith(
				expect.objectContaining({ ssrFileState: undefined }),
				expect.anything(),
			);
		});
	});
});
