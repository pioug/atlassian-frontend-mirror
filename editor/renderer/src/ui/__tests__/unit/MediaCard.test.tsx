import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import type { MediaCardProps } from '../../MediaCard';
import { MediaCardView, mediaIdentifierMap } from '../../MediaCard';

jest.mock('@atlaskit/media-card/cardLoader', () => ({
	...jest.requireActual('@atlaskit/media-card/cardLoader'),
	__esModule: true,
	default: jest.fn(() => null),
}));
jest.mock('@atlaskit/media-card/cardSync', () => ({
	...jest.requireActual('@atlaskit/media-card/cardSync'),
	__esModule: true,
	default: jest.fn(() => null),
}));
jest.mock('@atlaskit/media-card/cardLoading', () => ({
	...jest.requireActual('@atlaskit/media-card/cardLoading'),
	CardLoading: () => null,
}));
jest.mock('@atlaskit/media-card/cardError', () => ({
	...jest.requireActual('@atlaskit/media-card/cardError'),
	CardError: () => null,
}));

describe('MediaCard onError analytics', () => {
	let mockFireAnalyticsEvent: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockFireAnalyticsEvent = jest.fn();
	});

	const createMediaCardProps = (overrides?: Partial<MediaCardProps>): MediaCardProps => ({
		id: 'test-id',
		type: 'file',
		collection: 'test-collection',
		...overrides,
	});

	describe('when synced block context is provided', () => {
		it('forwards a consumer error without firing generic renderer analytics', () => {
			mockExpDisabled('platform_editor_media_error_analytics');
			const onError = jest.fn();
			const component = new MediaCardView({
				...createMediaCardProps({ onError }),
				fireAnalyticsEvent: mockFireAnalyticsEvent,
			});

			(component as any).getMediaErrorHandler()('test-error-reason');

			expect(onError).toHaveBeenCalledWith('test-error-reason');
			expect(mockFireAnalyticsEvent).not.toHaveBeenCalled();
		});

		it('should include nestedUnder in analytics attributes when nestedUnder prop is provided', () => {
			const onError = jest.fn();
			const props = createMediaCardProps({ nestedUnder: 'bodiedSyncBlock', onError });
			const component = new MediaCardView({
				...props,
				fireAnalyticsEvent: mockFireAnalyticsEvent,
			});

			// Call the private onError method
			(component as any).onError('test-error-reason');

			expect(onError).toHaveBeenCalledWith('test-error-reason');
			expect(mockFireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'errored',
				actionSubject: 'renderer',
				actionSubjectId: 'media',
				eventType: 'ui',
				attributes: {
					reason: 'test-error-reason',
					external: false,
					nestedUnder: 'bodiedSyncBlock',
				},
			});
		});

		it('should include nestedRendererType in analytics attributes when rendererContext.nestedRendererType is provided', () => {
			const props = createMediaCardProps({
				rendererContext: {
					nestedRendererType: 'syncedBlock',
				} as any,
			});
			const component = new MediaCardView({
				...props,
				fireAnalyticsEvent: mockFireAnalyticsEvent,
			});

			(component as any).onError('test-error-reason');

			expect(mockFireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'errored',
				actionSubject: 'renderer',
				actionSubjectId: 'media',
				eventType: 'ui',
				attributes: {
					reason: 'test-error-reason',
					external: false,
					nestedRendererType: 'syncedBlock',
				},
			});
		});

		it('should include both nestedUnder and nestedRendererType when both are provided', () => {
			const props = createMediaCardProps({
				nestedUnder: 'bodiedSyncBlock',
				rendererContext: {
					nestedRendererType: 'syncedBlock',
				} as any,
			});
			const component = new MediaCardView({
				...props,
				fireAnalyticsEvent: mockFireAnalyticsEvent,
			});

			(component as any).onError('test-error-reason');

			expect(mockFireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'errored',
				actionSubject: 'renderer',
				actionSubjectId: 'media',
				eventType: 'ui',
				attributes: {
					reason: 'test-error-reason',
					external: false,
					nestedUnder: 'bodiedSyncBlock',
					nestedRendererType: 'syncedBlock',
				},
			});
		});
	});
});

describe('MediaCard mediaIdentifierMap document order', () => {
	const fileMediaNode = (id: string) => ({
		type: 'mediaSingle',
		attrs: { layout: 'center' },
		content: [{ type: 'media', attrs: { id, type: 'file', collection: 'test-collection' } }],
	});

	const externalMediaNode = (url: string) => ({
		type: 'mediaSingle',
		attrs: { layout: 'center' },
		content: [{ type: 'media', attrs: { url, type: 'external' } }],
	});

	const adDoc = (content: unknown[]) => ({ type: 'doc', version: 1, content }) as any;

	// Drives the module-private `restoreDocumentOrder` through the lifecycle hook that
	// calls it, which is how a remounting card reaches it in the renderer.
	const mountCardForId = async (id: string, doc: unknown) => {
		const component = new MediaCardView({
			id,
			type: 'file',
			collection: 'test-collection',
			rendererContext: { adDoc: doc } as any,
		} as MediaCardProps);

		await component.componentDidMount();
	};

	beforeEach(() => {
		mediaIdentifierMap.clear();
	});

	it('leaves the map alone when its entries are already in document order', async () => {
		mockExpEnabled('cc_comments_media_viewer_sidebar');
		const doc = adDoc([fileMediaNode('file-a'), fileMediaNode('file-b')]);

		await mountCardForId('file-a', doc);
		await mountCardForId('file-b', doc);

		expect(Array.from(mediaIdentifierMap.keys())).toEqual(['file-a', 'file-b']);
	});

	it('restores document order when a card mounts after a card later in the document', async () => {
		mockExpEnabled('cc_comments_media_viewer_sidebar');
		const doc = adDoc([fileMediaNode('file-a'), fileMediaNode('file-b'), fileMediaNode('file-c')]);

		// `file-b` mounts first (it was on screen), so a plain Map would keep it first.
		await mountCardForId('file-b', doc);
		expect(Array.from(mediaIdentifierMap.keys())).toEqual(['file-b']);

		await mountCardForId('file-a', doc);

		expect(Array.from(mediaIdentifierMap.keys())).toEqual(['file-a', 'file-b']);
	});

	it('keys external images by their data URI and keeps them in document order', async () => {
		mockExpEnabled('cc_comments_media_viewer_sidebar');
		const dataURI = 'https://example.com/cat.png';
		const doc = adDoc([externalMediaNode(dataURI), fileMediaNode('file-a')]);

		await mountCardForId('file-a', doc);

		expect(Array.from(mediaIdentifierMap.keys())).toEqual([dataURI, 'file-a']);
	});

	// `mediaIdentifierMap` is one map shared by every `<Renderer>` on the page — other renderer
	// instances (an include, an excerpt, a comment body) can add their own entries to it. Those
	// aren't part of this document, so this renderer has no ordering info for them; it must leave
	// them alone rather than reorder or drop them.
	it('keeps entries from other renderer instances after this document, in their existing order', async () => {
		mockExpEnabled('cc_comments_media_viewer_sidebar');
		mediaIdentifierMap.set('foreign-1', { mediaItemType: 'file', id: 'foreign-1' } as any);
		mediaIdentifierMap.set('foreign-2', { mediaItemType: 'file', id: 'foreign-2' } as any);

		const doc = adDoc([fileMediaNode('file-a'), fileMediaNode('file-b')]);
		await mountCardForId('file-b', doc);
		await mountCardForId('file-a', doc);

		expect(Array.from(mediaIdentifierMap.keys())).toEqual([
			'file-a',
			'file-b',
			'foreign-1',
			'foreign-2',
		]);
	});

	it('preserves each entry against its key while reordering', async () => {
		mockExpEnabled('cc_comments_media_viewer_sidebar');
		const doc = adDoc([fileMediaNode('file-a'), fileMediaNode('file-b')]);

		await mountCardForId('file-b', doc);
		await mountCardForId('file-a', doc);

		expect(mediaIdentifierMap.get('file-a')).toEqual(
			expect.objectContaining({ mediaItemType: 'file', id: 'file-a' }),
		);
		expect(mediaIdentifierMap.get('file-b')).toEqual(
			expect.objectContaining({ mediaItemType: 'file', id: 'file-b' }),
		);
	});

	// `mediaIdentifierMap` feeds `mediaViewerItems`, which the Media Viewer indexes to pick
	// prev/next. With the experiment off a consumer who opted into nothing must keep the
	// historical mount-order list, unchanged by this feature — `restoreDocumentOrder` is never
	// called, so a pre-existing foreign entry is left alone too.
	it('leaves insertion order untouched when the experiment is off', async () => {
		mockExpDisabled('cc_comments_media_viewer_sidebar');
		mediaIdentifierMap.set('foreign-1', { mediaItemType: 'file', id: 'foreign-1' } as any);
		const doc = adDoc([fileMediaNode('file-a'), fileMediaNode('file-b'), fileMediaNode('file-c')]);

		await mountCardForId('file-b', doc);
		await mountCardForId('file-a', doc);

		// Mount order, not document order: `file-b` mounted first and stays first.
		expect(Array.from(mediaIdentifierMap.keys())).toEqual(['foreign-1', 'file-b', 'file-a']);
	});
});
