import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';

import type { MediaCardProps } from '../../MediaCard';
import { MediaCardView } from '../../MediaCard';

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
