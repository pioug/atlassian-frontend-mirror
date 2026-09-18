const mockCard = jest.fn();
const mockCardSync = jest.fn();

jest.mock('@atlaskit/media-card/cardLoader', () => {
	const actual = jest.requireActual('@atlaskit/media-card/cardLoader');
	const react = jest.requireActual('react');
	return {
		...jest.requireActual('@atlaskit/media-card/cardLoader'),
		__esModule: true,
		default: (props: Record<string, unknown>) => {
			mockCard(props);
			return react.createElement(actual.default, props);
		},
	};
});
jest.mock('@atlaskit/media-card/cardSync', () => {
	const actual = jest.requireActual('@atlaskit/media-card/cardSync');
	const react = jest.requireActual('react');
	return {
		...jest.requireActual('@atlaskit/media-card/cardSync'),
		__esModule: true,
		default: (props: Record<string, unknown>) => {
			mockCardSync(props);
			return react.createElement(actual.default, props);
		},
	};
});

import * as mocks from './media.mock';

import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';

import { AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { MediaType } from '@atlaskit/adf-schema/media';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createPlaceholderImageDataUrl } from '@atlaskit/editor-test-helpers/placeholder-images';
import type { CardEvent } from '@atlaskit/media-card/types';
import type { FileIdentifier, ExternalImageIdentifier } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import { sleep, nextTick, getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Media from '../../../../react/nodes/media';
import type { MediaSSR } from '../../../../types/mediaOptions';
import type { MediaCardProps } from '../../../../ui/MediaCard';
import {
	MediaCard,
	getListOfIdentifiersFromDoc,
	getClipboardAttrs,
	mediaIdentifierMap,
} from '../../../../ui/MediaCard';

// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
const doc = require('../../../../../examples/helper/media-layout.adf.json');

import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import {
	MediaClientContext,
	MediaClientProvider,
} from '@atlaskit/media-client-react/media-client-provider';

import { renderWithIntl } from '../../../__helpers/render';

jest.mock('../../../../ui/annotations/hooks/use-inline-comments-filter', () => ({
	...jest.requireActual('../../../../ui/annotations/hooks/use-inline-comments-filter'),
	useInlineCommentsFilter: jest.fn().mockReturnValue(['foo']),
}));

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

// External cards render a loading card until `withImageLoader` has seen the image load, which never
// happens in jsdom. Skipping the HOC lets the tests drive `imageStatus` through the prop instead.
jest.mock('@atlaskit/editor-common/utils', () => ({
	...jest.requireActual('@atlaskit/editor-common/utils'),
	withImageLoader: (Wrapped: unknown) => Wrapped,
}));

const MediaCardWithProvider = (props: MediaCardProps & ImageLoaderProps) => {
	return (
		<MediaClientContext.Provider value={mocks.mockMediaClient}>
			<MediaCard {...props} />
		</MediaClientContext.Provider>
	);
};

beforeEach(() => {
	jest.clearAllMocks();
});

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Media', () => {
	const mediaNode = {
		type: 'media',
		attrs: {
			type: 'file',
			id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
			collection: 'MediaServicesSample',
		},
	};

	const mediaClientConfig = getDefaultMediaClientConfig();

	const mediaProvider: MediaProvider = {
		viewMediaClientConfig: mediaClientConfig,
	};

	let providerFactory: ProviderFactory;

	const createFileIdentifier = (
		index = 0,
		collectionName = 'MediaServicesSample',
	): FileIdentifier => ({
		id: `b9d94b5f-e06c-4a80-bfda-00000000000${index}`,
		mediaItemType: 'file',
		collectionName,
	});

	const createExternalIdentifier = (index = 0): ExternalImageIdentifier => ({
		dataURI: `https://example.com/image${index}.png`,
		mediaItemType: 'external-image',
		name: `https://example.com/image${index}.png`,
	});

	const cachedIdentifiers = () => Array.from(mediaIdentifierMap.values());

	const lastCardProps = () => mockCard.mock.lastCall?.[0];

	const renderExternalCard = (identifier: ExternalImageIdentifier, extraProps?: object) => {
		const element = () => (
			<MediaCardWithProvider
				type="external"
				url={identifier.dataURI}
				rendererContext={{
					adDoc: {
						content: [
							{
								attrs: {
									height: 580,
									url: identifier.dataURI,
									type: 'external',
									width: 1021,
								},
								type: 'media',
							},
						],
					},
				}}
				imageStatus="complete"
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...extraProps}
			/>
		);
		const result = render(element());

		return { ...result, rerenderCard: () => result.rerender(element()) };
	};

	const renderFileCard = (identifier: FileIdentifier, adDocContent?: any) => {
		const content = adDocContent ?? [
			{
				attrs: {
					collection: identifier.collectionName,
					height: 580,
					id: identifier.id,
					type: 'file',
					width: 1021,
				},
				type: 'media',
			},
		];
		return render(
			<MediaCardWithProvider
				type="file"
				id={identifier.id}
				collection={identifier.collectionName}
				rendererContext={{
					adDoc: {
						content,
					},
				}}
				imageStatus="complete"
			/>,
		);
	};

	beforeEach(() => {
		providerFactory = new ProviderFactory();
		providerFactory.setProvider('mediaProvider', Promise.resolve(mediaProvider));
	});

	afterEach(() => {
		providerFactory.destroy();
		jest.clearAllMocks();
	});

	it('should render a media component with the proper props', async () => {
		const { container } = renderWithIntl(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={mediaNode.attrs.collection}
					providers={providerFactory}
					isDrafting={false}
				/>
			</MediaClientProvider>,
		);

		expect(screen.getByTestId('media-card-loading')).toBeVisible();

		await waitFor(() =>
			expect(container.querySelector('[data-node-type="media"]')).toHaveAttribute(
				'data-id',
				'5556346b-b081-482b-bc4a-4faca8ecd2de',
			),
		);
	});

	it('should render a media component with alt text if FF is on', async () => {
		const { container } = render(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					alt="test"
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					allowAltTextOnImages={true}
					providers={providerFactory}
					isDrafting={false}
				/>
			</MediaClientProvider>,
		);

		await waitFor(() =>
			expect(container.querySelector('[data-node-type="media"]')).toHaveAttribute(
				'data-alt',
				'test',
			),
		);
	});

	it('event handlers are not called when media is linked', async () => {
		const mediaOnClick = jest.fn();
		renderWithIntl(
			<Media
				type={mediaNode.attrs.type as MediaType}
				id={mediaNode.attrs.id}
				collection={mediaNode.attrs.collection}
				alt="test"
				marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
				isLinkMark={() => true}
				isBorderMark={() => false}
				allowAltTextOnImages={true}
				eventHandlers={{ media: { onClick: mediaOnClick } }}
				isDrafting={false}
			/>,
		);

		await userEvent.click(screen.getByRole('link'));

		expect(mediaOnClick).not.toHaveBeenCalled();
	});

	it('calls the link handlers when linked media is clicked', async () => {
		const linkOnClick = jest.fn();
		renderWithIntl(
			<Media
				type={mediaNode.attrs.type as MediaType}
				id={mediaNode.attrs.id}
				collection={mediaNode.attrs.collection}
				alt="test"
				marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
				isLinkMark={() => true}
				isBorderMark={() => false}
				allowAltTextOnImages={true}
				eventHandlers={{ link: { onClick: linkOnClick } }}
				isDrafting={false}
			/>,
		);

		await userEvent.click(screen.getByRole('link'));

		expect(linkOnClick).toHaveBeenCalledTimes(1);
		expect(linkOnClick).toHaveBeenCalledWith(expect.anything(), 'http://atlassian.com');
	});

	it('calls the click handler for media nodes without a link', async () => {
		const mediaOnClick = jest.fn();
		render(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					eventHandlers={{ media: { onClick: mediaOnClick } }}
					providers={providerFactory}
					isDrafting={false}
				/>
			</MediaClientProvider>,
		);

		await act(async () => {
			await Loadable.preloadAll();
		});

		const cardView = await screen.findByTestId('media-file-card-view');
		await userEvent.click(cardView);

		expect(mediaOnClick).toHaveBeenCalledTimes(1);
	});

	it('fires analytics on linked media', async () => {
		const mediaOnClick = jest.fn();
		const fireAnalyticsEvent = jest.fn();
		renderWithIntl(
			<Media
				type={mediaNode.attrs.type as MediaType}
				id={mediaNode.attrs.id}
				collection={mediaNode.attrs.collection}
				alt="test"
				fireAnalyticsEvent={fireAnalyticsEvent}
				marks={[{ attrs: { href: 'http://atlassian.com' } } as any]}
				isLinkMark={() => true}
				isBorderMark={() => false}
				allowAltTextOnImages={true}
				eventHandlers={{ media: { onClick: mediaOnClick } }}
				isDrafting={false}
			/>,
		);

		await userEvent.click(screen.getByRole('link'));

		expect(fireAnalyticsEvent).toHaveBeenCalledTimes(1);
		expect(fireAnalyticsEvent).toHaveBeenCalledWith({
			action: 'visited',
			actionSubject: 'media',
			actionSubjectId: 'link',
			attributes: {
				platform: 'web',
				mode: 'renderer',
			},
			eventType: 'track',
		});
	});

	describe('remix infographic analytics', () => {
		const dataConsumerMark = {
			type: 'dataConsumer',
			attrs: { sources: ['remix:infographic:charlie'] },
		} as any;

		it('reports mount and unmount lifecycle events to the media consumer', () => {
			const onMediaRenderEvent = jest.fn();
			const { unmount } = renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					marks={[dataConsumerMark]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					onMediaRenderEvent={onMediaRenderEvent}
					isDrafting={false}
				/>,
			);
			const mediaInstance = onMediaRenderEvent.mock.calls[0][0].mediaInstance;

			unmount();

			expect(onMediaRenderEvent).toHaveBeenNthCalledWith(2, {
				dataConsumerSource: 'remix:infographic:charlie',
				mediaId: mediaNode.attrs.id,
				mediaInstance,
				type: 'unmounted',
			});
		});

		it('media node with dataConsumer mark - fires a rendered track event with infographicType and renderer context on mount', () => {
			passGate('cc-maui-add-mark-for-remix-generated-images');
			const fireAnalyticsEvent = jest.fn();
			const onMediaRenderEvent = jest.fn();
			renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					marks={[dataConsumerMark]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					fireAnalyticsEvent={fireAnalyticsEvent}
					onMediaRenderEvent={onMediaRenderEvent}
					isDrafting={false}
				/>,
			);

			expect(fireAnalyticsEvent).toHaveBeenCalledTimes(1);
			expect(fireAnalyticsEvent).toHaveBeenCalledWith({
				action: 'rendered',
				actionSubject: 'media',
				actionSubjectId: mediaNode.attrs.id,
				eventType: 'track',
				attributes: {
					infographicType: 'remix:infographic:charlie',
					pageMode: 'view',
					mediaId: mediaNode.attrs.id,
				},
			});
			expect(onMediaRenderEvent).toHaveBeenCalledWith({
				dataConsumerSource: 'remix:infographic:charlie',
				mediaId: mediaNode.attrs.id,
				mediaInstance: expect.any(Object),
				type: 'mounted',
			});
		});

		it('media node with dataConsumer mark (gate OFF) - does not fire a rendered event on mount', () => {
			failGate('cc-maui-add-mark-for-remix-generated-images');
			const fireAnalyticsEvent = jest.fn();
			const onMediaRenderEvent = jest.fn();
			renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					marks={[dataConsumerMark]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					fireAnalyticsEvent={fireAnalyticsEvent}
					onMediaRenderEvent={onMediaRenderEvent}
					isDrafting={false}
				/>,
			);

			expect(fireAnalyticsEvent).not.toHaveBeenCalled();
			expect(onMediaRenderEvent).toHaveBeenCalledWith({
				dataConsumerSource: 'remix:infographic:charlie',
				mediaId: mediaNode.attrs.id,
				mediaInstance: expect.any(Object),
				type: 'mounted',
			});
		});

		it('media node without dataConsumer mark - does not fire a rendered event on mount', () => {
			passGate('cc-maui-add-mark-for-remix-generated-images');
			const fireAnalyticsEvent = jest.fn();
			renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					fireAnalyticsEvent={fireAnalyticsEvent}
					isDrafting={false}
				/>,
			);

			expect(fireAnalyticsEvent).not.toHaveBeenCalled();
		});

		it('media node with dataConsumer mark with empty sources - does not fire a rendered event on mount', () => {
			passGate('cc-maui-add-mark-for-remix-generated-images');
			const fireAnalyticsEvent = jest.fn();
			const emptySourcesMark = {
				type: 'dataConsumer',
				attrs: { sources: [] },
			} as any;
			renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					marks={[emptySourcesMark]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					fireAnalyticsEvent={fireAnalyticsEvent}
					isDrafting={false}
				/>,
			);

			expect(fireAnalyticsEvent).not.toHaveBeenCalled();
		});
	});

	it('should render a media component without alt text if FF is off', async () => {
		const { container } = render(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					alt="test"
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					allowAltTextOnImages={false}
					providers={providerFactory}
					isDrafting={false}
				/>
			</MediaClientProvider>,
		);

		await waitFor(() =>
			expect(container.querySelector('[data-node-type="media"]')).toBeInTheDocument(),
		);
		expect(container.querySelector('[data-node-type="media"]')).not.toHaveAttribute('data-alt');
	});

	it('should render a media component with external image', () => {
		render(
			<Media
				type="external"
				url="http://image.jpg"
				marks={[]}
				isLinkMark={() => false}
				isBorderMark={() => false}
				isDrafting={false}
			/>,
		);

		expect(screen.getByTestId('media-card-loading')).toBeVisible();
	});

	describe('Media SSR', () => {
		const config: MediaClientConfig = {
			authProvider: () => Promise.reject(new Error('do not use')),
			initialAuth: {
				clientId: 'clientId',
				token: 'token',
				baseUrl: 'baseUrl',
			},
		};

		it('should build synchronous mediaClientConfig when ssr="server"', () => {
			const ssr: MediaSSR = { mode: 'server', config };

			const { container } = render(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={mediaNode.attrs.collection}
					ssr={ssr}
					isDrafting={false}
				/>,
			);

			expect(container.querySelectorAll('[data-node-type="media"]')).toHaveLength(1);
			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ ssr: ssr.mode, mediaClientConfig: config }),
			);
		});

		it('should build synchronous mediaClientConfig when ssr="client"', () => {
			const ssr: MediaSSR = { mode: 'client', config };

			const { container } = render(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={mediaNode.attrs.collection}
					ssr={ssr}
					isDrafting={false}
				/>,
			);

			expect(container.querySelectorAll('[data-node-type="media"]')).toHaveLength(1);
			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ ssr: ssr.mode, mediaClientConfig: config }),
			);
		});
	});

	describe('<MediaCard />', () => {
		it.each([
			[true, 'Alt text'],
			[false, undefined],
		])(
			`shows alt text on an external media based on allowAltTextOnImages, when flag is %s`,
			async (allowAltTextOnImages, expectedAltText) => {
				const externalIdentifier = createExternalIdentifier();
				renderExternalCard(externalIdentifier, {
					alt: expectedAltText,
					allowAltTextOnImages: allowAltTextOnImages,
				});
				await act(async () => {
					await sleep(0);
				});

				expect(mockCard).toHaveBeenLastCalledWith(
					expect.objectContaining({ alt: expectedAltText }),
				);
			},
		);

		it('should pass shouldOpenMediaViewer=true if there is no onClick callback', () => {
			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" eventHandlers={{ media: { onClick: jest.fn() } }} />
				</MediaClientProvider>,
			);

			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: false }),
			);

			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" />
				</MediaClientProvider>,
			);

			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: true }),
			);
		});

		it('should pass shouldOpenMediaViewer=true if renderer appearance is not mobile', () => {
			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" />
				</MediaClientProvider>,
			);

			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: true }),
			);
		});

		it('should pass shouldOpenMediaViewer=true if property shouldOpenMediaViewer is set to true', () => {
			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard
						type="file"
						id="1"
						shouldOpenMediaViewer={true}
						eventHandlers={{ media: { onClick: jest.fn() } }}
					/>
				</MediaClientProvider>,
			);

			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: true }),
			);

			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" shouldOpenMediaViewer={true} />
				</MediaClientProvider>,
			);

			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: true }),
			);
		});

		it('should pass shouldOpenMediaViewer=false if property shouldOpenMediaViewer is set to false', () => {
			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard
						type="file"
						id="1"
						shouldOpenMediaViewer={false}
						eventHandlers={{ media: { onClick: jest.fn() } }}
					/>
				</MediaClientProvider>,
			);
			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: false }),
			);

			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" shouldOpenMediaViewer={false} />
				</MediaClientProvider>,
			);

			expect(mockCard).toHaveBeenLastCalledWith(
				expect.objectContaining({ shouldOpenMediaViewer: false }),
			);
		});

		it('should call passed onClick', () => {
			const onClick = jest.fn();
			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />
				</MediaClientProvider>,
			);

			const event: CardEvent = {
				event: {} as any,
				mediaItemDetails: {
					id: 'some-id',
					mediaType: 'image',
				},
			};
			lastCardProps().onClick(event);

			expect(onClick).toHaveBeenCalledWith(event, undefined);
		});

		it('should not call passed onClick when inline video is enabled and its a video file', () => {
			const onClick = jest.fn();
			render(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />
				</MediaClientProvider>,
			);

			const event: CardEvent = {
				event: {} as any,
				mediaItemDetails: {
					id: 'some-id',
					mediaType: 'video',
				},
			};
			lastCardProps().onClick(event);

			expect(onClick).not.toHaveBeenCalled();
		});
		it('should save fileState when id changes', async () => {
			const fileIdentifier = createFileIdentifier();
			const { rerender } = renderFileCard(fileIdentifier);

			await act(async () => {
				await nextTick();
			});

			rerender(
				<MediaCardWithProvider
					type="file"
					id="123"
					collection={fileIdentifier.collectionName}
					rendererContext={{
						adDoc: {
							content: [],
						},
					}}
					imageStatus="complete"
				/>,
			);

			await nextTick();

			expect(mocks.mockMediaClient.file.getCurrentState).toHaveBeenCalledTimes(2);
		});

		describe('populates identifier cache for the page mediaClientConfig', () => {
			it('should have a mediaViewerItems if doc is passed for a file card', async () => {
				const fileIdentifier = createFileIdentifier();
				renderFileCard(fileIdentifier);

				await act(async () => {
					await sleep(0);
				});

				expect(mockCard).toHaveBeenLastCalledWith(
					expect.objectContaining({ mediaViewerItems: [fileIdentifier] }),
				);
			});

			it('should have a mediaViewerItems if doc is passed for an external card', async () => {
				const externalIdentifier = createExternalIdentifier();
				const { rerenderCard } = renderExternalCard(externalIdentifier);

				await act(async () => {
					await sleep(0);
				});
				// the cache is populated on mount, so the card only sees it from the next render on
				rerenderCard();

				expect(mockCard).toHaveBeenLastCalledWith(
					expect.objectContaining({ mediaViewerItems: [externalIdentifier] }),
				);
			});

			it('should have a mediaViewerItems if doc content has mutiple media cards with different collection ids', async () => {
				const fileIdentifier = createFileIdentifier(1, 'collection1');
				const fileIdentifier2 = createFileIdentifier(2, 'collection2');
				const adDocContent = [
					{
						attrs: {
							collection: fileIdentifier.collectionName,
							height: 580,
							id: fileIdentifier.id,
							type: 'file',
							width: 1021,
						},
						type: 'media',
					},
					{
						attrs: {
							collection: fileIdentifier2.collectionName,
							height: 580,
							id: fileIdentifier2.id,
							type: 'file',
							width: 1021,
						},
						type: 'media',
					},
				];
				const { container } = renderFileCard(fileIdentifier, adDocContent);

				await waitFor(() =>
					expect(container.querySelectorAll('div[data-node-type="media"]')).toHaveLength(1),
				);
				let mediaNodes = container.querySelectorAll('div[data-node-type="media"]');
				expect(mediaNodes[0]).toHaveAttribute('data-id', 'b9d94b5f-e06c-4a80-bfda-000000000001');
				expect(mediaNodes[0]).toHaveAttribute('data-type', 'file');
				expect(mediaNodes[0]).toHaveAttribute('data-collection', 'collection1');

				// Render is not idempotent
				render(
					<MediaClientProvider clientConfig={mediaClientConfig}>
						<MediaCard
							type="file"
							id={fileIdentifier2.id}
							collection={fileIdentifier2.collectionName}
							rendererContext={{
								adDoc: {
									content: adDocContent,
								},
							}}
							imageStatus="complete"
						/>
					</MediaClientProvider>,
				);

				await waitFor(() =>
					expect(document.body.querySelectorAll('div[data-node-type="media"]')).toHaveLength(2),
				);
				mediaNodes = document.body.querySelectorAll('div[data-node-type="media"]');
				expect(mediaNodes[0]).toHaveAttribute('data-id', 'b9d94b5f-e06c-4a80-bfda-000000000001');
				expect(mediaNodes[0]).toHaveAttribute('data-type', 'file');
				expect(mediaNodes[0]).toHaveAttribute('data-collection', 'collection1');

				await waitFor(() =>
					expect(mediaNodes[1]).toHaveAttribute('data-id', 'b9d94b5f-e06c-4a80-bfda-000000000002'),
				);
				expect(mediaNodes[1]).toHaveAttribute('data-type', 'file');
				expect(mediaNodes[1]).toHaveAttribute('data-collection', 'collection2');
			});

			it('should add newly mounted external cards to the list', async () => {
				const fileIdentifier = createFileIdentifier(1);
				const externalIdentifier = createExternalIdentifier(1);
				renderFileCard(fileIdentifier);

				await waitFor(() => expect(cachedIdentifiers()).toEqual([fileIdentifier]));

				renderExternalCard(externalIdentifier);

				await waitFor(() =>
					expect(cachedIdentifiers()).toEqual([fileIdentifier, externalIdentifier]),
				);
			});

			it('should remove card from the list if a card is unmounted', async () => {
				const fileIdentifier0 = createFileIdentifier(2);
				const fileIdentifier1 = createFileIdentifier(3);
				const externalIdentifier0 = createExternalIdentifier(2);
				const externalIdentifier1 = createExternalIdentifier(3);
				const mediaFileCard0 = renderFileCard(fileIdentifier0);
				renderFileCard(fileIdentifier1);
				renderExternalCard(externalIdentifier0);
				const mediaExternalCard1 = renderExternalCard(externalIdentifier1);

				await waitFor(() =>
					expect(cachedIdentifiers()).toEqual([
						fileIdentifier0,
						fileIdentifier1,
						externalIdentifier0,
						externalIdentifier1,
					]),
				);

				mediaFileCard0.unmount();
				mediaExternalCard1.unmount();

				expect(cachedIdentifiers()).toEqual([fileIdentifier1, externalIdentifier0]);
			});
		});

		it('should add media attrs for copy and paste', async () => {
			const fileIdentifier = createFileIdentifier();
			const { container } = renderFileCard(fileIdentifier);

			await act(async () => {
				await sleep();
			});

			const mediaNodes = container.querySelectorAll('[data-node-type="media"]');

			expect(mediaNodes).toHaveLength(1);
			expect(mediaNodes[0]).toHaveAttribute('data-type', 'file');
			expect(mediaNodes[0]).toHaveAttribute('data-id', fileIdentifier.id);
			expect(mediaNodes[0]).toHaveAttribute('data-collection', 'MediaServicesSample');
			expect(mediaNodes[0]).not.toHaveAttribute('data-context-id');
			expect(mediaNodes[0]).not.toHaveAttribute('data-width');
			expect(mediaNodes[0]).not.toHaveAttribute('data-height');
		});

		describe('disable lazy loading for Confluence PDF export pages', () => {
			const originalLocation = window.location;

			beforeEach(() => {
				Object.defineProperty(window, 'location', {
					value: {
						...originalLocation,
						href: '',
					},
					writable: true,
				});
			});

			afterEach(() => {
				Object.defineProperty(window, 'location', {
					value: originalLocation,
					writable: true,
				});
			});

			it('should disable lazy loading when URL includes /wiki/pdf/spaces/', () => {
				window.location.href = 'https://example.atlassian.net/wiki/pdf/spaces/SPACE/pages/123456';

				render(
					<MediaClientProvider clientConfig={mediaClientConfig}>
						<MediaCard type="file" id="1" />
					</MediaClientProvider>,
				);

				expect(mockCard).toHaveBeenLastCalledWith(expect.objectContaining({ isLazy: false }));
			});

			it('should enable lazy loading when URL does not include /wiki/pdf/spaces/', () => {
				window.location.href = 'https://example.atlassian.net/wiki/spaces/SPACE/pages/123456';

				render(
					<MediaClientProvider clientConfig={mediaClientConfig}>
						<MediaCard type="file" id="1" />
					</MediaClientProvider>,
				);

				expect(mockCard).toHaveBeenLastCalledWith(expect.objectContaining({ isLazy: true }));
			});
		});
	});

	describe('getClipboardAttrs()', () => {
		it('should return all needed properties for copy & paste', () => {
			expect(getClipboardAttrs({ id: '1', collection: 'collection' })).toEqual({
				'data-context-id': undefined,
				'data-type': 'file',
				'data-node-type': 'media',
				'data-width': undefined,
				'data-height': undefined,
				'data-id': '1',
				'data-collection': 'collection',
				'data-file-name': 'file',
				'data-file-size': 1,
				'data-file-mime-type': '',
			});
		});

		it('should get width and height from originalDimensions', () => {
			expect(
				getClipboardAttrs({
					id: '1',
					originalDimensions: { height: 40, width: 50 },
				}),
			).toEqual({
				'data-context-id': undefined,
				'data-type': 'file',
				'data-node-type': 'media',
				'data-width': 50,
				'data-height': 40,
				'data-id': '1',
				'data-collection': undefined,
				'data-file-name': 'file',
				'data-file-size': 1,
				'data-file-mime-type': '',
			});
		});

		it('should return context-id', () => {
			expect(
				getClipboardAttrs({
					id: '1',
					contextIdentifierProvider: {
						objectId: 'object-id',
						containerId: 'container',
					},
				}),
			).toEqual({
				'data-context-id': 'object-id',
				'data-type': 'file',
				'data-node-type': 'media',
				'data-width': undefined,
				'data-height': undefined,
				'data-id': '1',
				'data-collection': undefined,
				'data-file-name': 'file',
				'data-file-size': 1,
				'data-file-mime-type': '',
			});
		});

		it('should use fileState fields', () => {
			expect(
				getClipboardAttrs({
					id: '1',
					contextIdentifierProvider: {
						objectId: 'object-id',
						containerId: 'container',
					},
					fileState: {
						status: 'processing',
						id: '1',
						mediaType: 'image',
						mimeType: 'image/png',
						name: 'some_name',
						size: 5,
					},
				}),
			).toEqual({
				'data-context-id': 'object-id',
				'data-type': 'file',
				'data-node-type': 'media',
				'data-width': undefined,
				'data-height': undefined,
				'data-id': '1',
				'data-collection': undefined,
				'data-file-name': 'some_name',
				'data-file-size': 5,
				'data-file-mime-type': 'image/png',
			});
		});
	});

	describe('#getListOfIdentifiersFromDoc()', () => {
		const external0 = {
			dataURI:
				'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon-152x152.png',
			mediaItemType: 'external-image',
			name: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon-152x152.png',
		};
		const external1 = {
			dataURI: createPlaceholderImageDataUrl(2850, 80),
			mediaItemType: 'external-image',
			name: createPlaceholderImageDataUrl(2850, 80),
		};
		const file0 = {
			id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
			mediaItemType: 'file',
		};
		const file1 = {
			id: 'eff24b3b-fe78-4787-805e-492b28991232',
			mediaItemType: 'file',
		};

		it('should return empty array if nothing is found', () => {
			expect(getListOfIdentifiersFromDoc({ ...doc, content: [] })).toEqual([]);
		});

		it('should transform both external images and files', () => {
			expect(getListOfIdentifiersFromDoc(doc)).toEqual(
				expect.arrayContaining([external0, external1, file0, file1]),
			);
		});

		it("should not explode if node doesn't have attrs", () => {
			expect(
				getListOfIdentifiersFromDoc({
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'center',
							},
							content: [
								{
									type: 'media',
									attrs: {
										type: 'external',
										width: 152,
										height: 152,
									},
								},
							],
						},
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'full-width',
							},
							content: [
								{
									type: 'media',
									attrs: {
										id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
										type: 'file',
										collection: 'MediaServicesSample',
										width: 5845,
										height: 1243,
									},
								},
							],
						},
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'wrap-left',
							},
							content: [
								{
									type: 'media',
									attrs: {
										type: 'external',
										url: createPlaceholderImageDataUrl(2850, 80),
									},
								},
							],
						},
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'wrap-left',
							},
							content: [
								{
									type: 'media',
									attrs: {},
								},
							],
						},
					],
				}),
			).toEqual([file0, external1]);
		});

		it("should not explode if node attrs don't have urls", () => {
			expect(
				getListOfIdentifiersFromDoc({
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'center',
							},
							content: [
								{
									type: 'media',
									attrs: {},
								},
							],
						},
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'full-width',
							},
							content: [
								{
									type: 'media',
									attrs: {
										id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
										type: 'file',
										collection: 'MediaServicesSample',
										width: 5845,
										height: 1243,
									},
								},
							],
						},
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'wrap-left',
							},
							content: [
								{
									type: 'media',
									attrs: {
										type: 'external',
										url: createPlaceholderImageDataUrl(2850, 80),
									},
								},
							],
						},
						{
							type: 'mediaSingle',
							attrs: {
								layout: 'wrap-left',
							},
							content: [
								{
									type: 'media',
									attrs: {
										type: 'file',
										collection: 'MediaServicesSample',
										width: 6000,
										height: 4000,
									},
								},
							],
						},
					],
				}),
			).toEqual([file0, external1]);
		});
	});

	describe('Media Border Mark', () => {
		it('should render border mark with right color and size (old behavior) - should use borderWidth as borderRadius', () => {
			failGate('platform_editor_media_border_radius_fix');
			const { container } = renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					alt="test"
					marks={[
						{
							type: 'border',
							attrs: {
								color: '#091E4224',
								size: 3,
							},
						},
					]}
					isLinkMark={() => false}
					isBorderMark={() => true}
					allowAltTextOnImages={false}
					isDrafting={false}
				/>,
			);

			const borders = container.querySelectorAll('div[data-mark-type="border"]');
			expect(borders).toHaveLength(1);
			expect(getComputedStyle(borders[0]).getPropertyValue('box-shadow')).toContain('3px');
			expect(getComputedStyle(borders[0])).toHaveProperty('borderRadius', '3px');
		});

		it('should render border mark with right color and size (new behavior) - should use 8px as borderRadius', () => {
			passGate('platform_editor_media_border_radius_fix');
			const { container } = renderWithIntl(
				<Media
					type={mediaNode.attrs.type as MediaType}
					id={mediaNode.attrs.id}
					collection={mediaNode.attrs.collection}
					alt="test"
					marks={[
						{
							type: 'border',
							attrs: {
								color: '#091E4224',
								size: 3,
							},
						},
					]}
					isLinkMark={() => false}
					isBorderMark={() => true}
					allowAltTextOnImages={false}
					isDrafting={false}
				/>,
			);

			const borders = container.querySelectorAll('div[data-mark-type="border"]');
			expect(borders).toHaveLength(1);
			expect(getComputedStyle(borders[0]).getPropertyValue('box-shadow')).toContain('3px');
			expect(getComputedStyle(borders[0])).toHaveProperty(
				'borderRadius',
				'var(--ds-radius-large, 8px)',
			);
		});
	});

	describe('Media Annotation Mark', () => {
		describe('when feature is enabled', () => {
			it('renders badge when annotation exists', () => {
				const result = renderWithIntl(
					<Media
						type={mediaNode.attrs.type as MediaType}
						id={mediaNode.attrs.id}
						collection={mediaNode.attrs.collection}
						alt="test"
						marks={[
							{
								type: 'annotation',
								attrs: {
									id: 'foo',
									annotationType: AnnotationTypes.INLINE_COMMENT,
								},
							},
						]}
						isLinkMark={() => false}
						isBorderMark={() => false}
						isAnnotationMark={() => true}
						allowAltTextOnImages={false}
						isDrafting={false}
						featureFlags={undefined}
						mediaSingleElement={document.createElement('div')}
					/>,
				);
				expect(result.container.querySelector('#foo')).toBeInTheDocument();
				expect(screen.queryByLabelText('View comments')).toBeInTheDocument();
			});
			it('renders draft badge when annotation does not exist and draft mode is true', () => {
				const result = renderWithIntl(
					<Media
						type={mediaNode.attrs.type as MediaType}
						id={mediaNode.attrs.id}
						collection={mediaNode.attrs.collection}
						alt="test"
						marks={[]}
						isLinkMark={() => false}
						isBorderMark={() => false}
						isAnnotationMark={() => true}
						allowAltTextOnImages={false}
						isDrafting={true}
						featureFlags={undefined}
						mediaSingleElement={document.createElement('div')}
					/>,
				);
				expect(result.container.querySelector('#foo')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('View comments')).toBeInTheDocument();
			});
		});
	});

	describe('annotation attributes', () => {
		const dataAttributes = { 'data-node-type': 'media', 'data-renderer-start-pos': 4 };
		test('adds correct annotation attributes to media node', async () => {
			const externalIdentifier = createExternalIdentifier();
			const { container } = renderExternalCard(externalIdentifier, { dataAttributes });

			await act(async () => {
				await sleep(0);
			});

			const mediaNode = container.querySelector('[data-node-type="media"]');

			expect(mediaNode).toBeInTheDocument();
			expect(mediaNode).toHaveAttribute('data-renderer-start-pos', '4');
		});
	});

	it('should use CardSync when feature flag is on and enableSyncMediaCard is true', () => {
		render(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<MediaCard type="file" id="1" enableSyncMediaCard={true} />
			</MediaClientProvider>,
		);

		expect(mockCardSync).toHaveBeenCalled();
		expect(mockCard).not.toHaveBeenCalled();
	});

	it('should use CardAsync when feature flag is on and enableSyncMediaCard is false', () => {
		render(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<MediaCard type="file" id="1" enableSyncMediaCard={false} />
			</MediaClientProvider>,
		);

		expect(mockCard).toHaveBeenCalled();
		expect(mockCardSync).not.toHaveBeenCalled();
	});

	it('should use CardAsync when feature flag is on and enableSyncMediaCard is undefined', () => {
		render(
			<MediaClientProvider clientConfig={mediaClientConfig}>
				<MediaCard type="file" id="1" />
			</MediaClientProvider>,
		);

		expect(mockCard).toHaveBeenCalled();
		expect(mockCardSync).not.toHaveBeenCalled();
	});
});
