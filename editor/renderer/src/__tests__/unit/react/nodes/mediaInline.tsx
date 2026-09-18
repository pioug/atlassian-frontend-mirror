const mockMediaInlineCard = jest.fn();
jest.mock('@atlaskit/media-card/loader', () => {
	const actual = jest.requireActual('@atlaskit/media-card/loader');
	const react = jest.requireActual('react');
	return {
		...jest.requireActual('@atlaskit/media-card/loader'),
		__esModule: true,
		default: (props: Record<string, unknown>) => {
			mockMediaInlineCard(props);
			return react.createElement(actual.default, props);
		},
	};
});

import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';

import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import type { InlineCardEvent } from '@atlaskit/media-card/types';
import type { FileDetails } from '@atlaskit/media-client';
import { MediaClientContext } from '@atlaskit/media-client-react/media-client-provider';
import { fakeMediaClient, getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import MediaInline from '../../../../react/nodes/mediaInline';

describe('MediaInline', () => {
	let providerFactory: ProviderFactory;
	let mediaProvider: MediaProvider;
	const mockFile = {
		type: 'file',
		id: '7113fcea-49ea-4a46-9ed5-c0f2991841e0',
		collection: 'test-collection',
	};

	// eslint-disable-next-line @atlaskit/platform/no-set-immediate
	const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

	beforeEach(() => {
		mediaProvider = {
			viewMediaClientConfig: getDefaultMediaClientConfig(),
		};
		providerFactory = new ProviderFactory();
		providerFactory.setProvider('mediaProvider', Promise.resolve(mediaProvider));
	});

	afterEach(() => {
		jest.clearAllMocks();
		providerFactory.destroy();
	});

	it('should render a <span> tag', async () => {
		const { container } = renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} {...mockFile} />
			</MediaClientContext.Provider>,
		);
		await waitFor(() =>
			expect(container.querySelector('span[data-node-type="mediaInline"')).toBeVisible(),
		);
	});

	it('should render with correct props passed down to component', async () => {
		const { container } = renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} {...mockFile} />
			</MediaClientContext.Provider>,
		);

		await waitFor(() =>
			expect(container.querySelector('span[data-node-type="mediaInline"')).toHaveAttribute(
				'data-id',
				'7113fcea-49ea-4a46-9ed5-c0f2991841e0',
			),
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).toHaveAttribute(
			'data-collection',
			'test-collection',
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).toHaveAttribute(
			'data-type',
			'file',
		);
	});

	it('should return loading view without message when no mediaClientConfig is present', async () => {
		providerFactory.setProvider('mediaProvider', Promise.resolve({} as MediaProvider));
		renderWithIntl(<MediaInline providers={providerFactory} {...mockFile} />);

		const mediaInlineLoadingView = await screen.findByTestId('media-inline-card-loading-view');
		expect(mediaInlineLoadingView).toBeVisible();
		expect(mediaInlineLoadingView).toHaveTextContent('');
		expect(mediaInlineLoadingView).not.toHaveFocus();
	});

	it('renders MediaInlineCard when mediaClientConfig is present', async () => {
		const { container } = renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} {...mockFile} />
			</MediaClientContext.Provider>,
		);

		await waitFor(() =>
			expect(container.querySelector('span[data-node-type="mediaInline"')).toBeVisible(),
		);
	});

	it('should render with shouldOpenMediaViewer set to true when appearance is not mobile', async () => {
		renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} {...mockFile} />
			</MediaClientContext.Provider>,
		);
		await act(async () => {
			await flushPromises();
		});

		expect(mockMediaInlineCard).toHaveBeenLastCalledWith(
			expect.objectContaining({ shouldOpenMediaViewer: true }),
		);
	});

	it('passes the matching ssrMediaItem to MediaInlineCard', async () => {
		const matchingItem = { id: mockFile.id, details: { name: 'inline.png' } };
		const otherItem = { id: 'other-id', details: { name: 'other.png' } };
		const ssr = {
			mode: 'server' as const,
			config: getDefaultMediaClientConfig(),
			ssrMediaItems: [otherItem, matchingItem],
		};

		renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} ssr={ssr} {...mockFile} />
			</MediaClientContext.Provider>,
		);
		await act(async () => {
			await flushPromises();
		});

		expect(mockMediaInlineCard).toHaveBeenLastCalledWith(
			expect.objectContaining({ ssrMediaItem: matchingItem }),
		);
	});

	it('should add media attrs for copy and paste', async () => {
		const { container } = renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} {...mockFile} />
			</MediaClientContext.Provider>,
		);

		await waitFor(() =>
			expect(container.querySelector('span[data-node-type="mediaInline"')).toHaveAttribute(
				'data-id',
				'7113fcea-49ea-4a46-9ed5-c0f2991841e0',
			),
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).toHaveAttribute(
			'data-collection',
			'test-collection',
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).toHaveAttribute(
			'data-type',
			'file',
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).not.toHaveAttribute(
			'data-context-id',
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).not.toHaveAttribute(
			'data-width',
		);
		expect(container.querySelector('span[data-node-type="mediaInline"')).not.toHaveAttribute(
			'data-height',
		);
	});

	it('should invoke onclick callback with mediaItemDetails when click', async () => {
		const mockCardEventClickHandler = jest.fn();
		const eventHandlers: EventHandlers = {
			media: {
				onClick: mockCardEventClickHandler,
			},
		};

		renderWithIntl(
			<MediaClientContext.Provider value={fakeMediaClient()}>
				<MediaInline providers={providerFactory} eventHandlers={eventHandlers} {...mockFile} />
			</MediaClientContext.Provider>,
		);

		await act(async () => {
			await flushPromises();
		});

		const mediaItemDetails: FileDetails = {
			id: '7113fcea-49ea-4a46-9ed5-c0f2991841e0',
			mediaType: 'video',
		};
		const event: InlineCardEvent = {
			event: {} as any,
			mediaItemDetails: mediaItemDetails,
		};
		mockMediaInlineCard.mock.lastCall?.[0].onClick(event);

		expect(mockCardEventClickHandler).toHaveBeenCalledTimes(1);
		expect(mockCardEventClickHandler).toHaveBeenCalledWith(
			expect.objectContaining({ mediaItemDetails: mediaItemDetails }),
		);
	});
});
