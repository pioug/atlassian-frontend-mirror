import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import type { MediaCardProps } from '../../MediaCard';
import { MediaCardView } from '../../MediaCard';

jest.mock('@atlaskit/media-card', () => ({
	Card: jest.fn(() => null),
	CardSync: jest.fn(() => null),
	CardLoading: () => null,
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

	eeTest.describe('platform_synced_block', 'when experiment is enabled').variant(true, () => {
		it('should include nestedUnder in analytics attributes when nestedUnder prop is provided', () => {
			const props = createMediaCardProps({ nestedUnder: 'bodiedSyncBlock' });
			const component = new MediaCardView({
				...props,
				fireAnalyticsEvent: mockFireAnalyticsEvent,
			});

			// Call the private onError method
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
