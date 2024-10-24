import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Loadable from 'react-loadable';

import type { MediaClientConfig } from '@atlaskit/media-core';
import { AnnotationTypes, type MediaType } from '@atlaskit/adf-schema';
import type { CardEvent } from '@atlaskit/media-card';
import type { FileIdentifier, ExternalImageIdentifier } from '@atlaskit/media-client';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { Card } from '@atlaskit/media-card';
import { sleep, nextTick, getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import * as mocks from './media.mock';
import Media from '../../../../react/nodes/media';
import type { MediaCardProps } from '../../../../ui/MediaCard';
import {
	MediaCard,
	getListOfIdentifiersFromDoc,
	getClipboardAttrs,
	MediaCardView,
} from '../../../../ui/MediaCard';
import type { MediaSSR } from '../../../../types/mediaOptions';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const doc = require('../../../../../examples/helper/media-layout.adf.json');

import { MediaClientContext, MediaClientProvider } from '@atlaskit/media-client-react';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import { renderWithIntl } from '../../../__helpers/render';

jest.mock('../../../../ui/annotations/hooks', () => ({
	...jest.requireActual('../../../../ui/annotations/hooks'),
	useInlineCommentsFilter: jest.fn().mockReturnValue(['foo']),
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

	const mountFileCard = async (identifier: FileIdentifier, adDocContent?: any) => {
		const content = adDocContent ?? [
			{
				attrs: {
					collection: identifier.collectionName,
					height: 580,
					id: await identifier.id,
					type: 'file',
					width: 1021,
				},
				type: 'media',
			},
		];
		const card = mount(
			<MediaCardWithProvider
				type="file"
				id={await identifier.id}
				collection={identifier.collectionName}
				rendererContext={{
					adDoc: {
						content,
					},
				}}
			/>,
		);

		const mediaCard = card.find(MediaCard);
		mediaCard.setState({ imageStatus: 'complete' });
		mediaCard.update();
		return card;
	};

	const mountExternalCard = (identifier: ExternalImageIdentifier, extraProps?: Object) => {
		const card = mount(
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
				{...extraProps}
			/>,
		);
		const mediaCard = card.find(MediaCard);
		mediaCard.setState({ imageStatus: 'complete' });
		mediaCard.update();
		return card;
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
		const component = (
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
			/>
		);
		return render(component);
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
		const { container } = render(
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
		render(
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

		await userEvent.click(screen.getByRole('link', { name: '' }));

		expect(mediaOnClick).not.toHaveBeenCalled();
	});

	it('calls the link handlers when linked media is clicked', async () => {
		const linkOnClick = jest.fn();
		render(
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

		await userEvent.click(screen.getByRole('link', { name: '' }));

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
		render(
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

		await userEvent.click(screen.getByRole('link', { name: '' }));

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

			const mediaComponent = mount(
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

			expect(mediaComponent.find(MediaCard).length).toEqual(1);
			expect(mediaComponent.find(Card).length).toEqual(1);

			const mediaCard = mediaComponent.find(MediaCard);
			expect(mediaCard.prop('ssr')).toEqual(ssr);

			const card = mediaComponent.find(Card);
			expect(card.prop('mediaClientConfig')).toEqual(config);

			mediaComponent.unmount();
		});

		it('should build synchronous mediaClientConfig when ssr="client"', () => {
			const ssr: MediaSSR = { mode: 'client', config };

			const mediaComponent = mount(
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

			expect(mediaComponent.find(MediaCard).length).toEqual(1);
			expect(mediaComponent.find(Card).length).toEqual(1);

			const mediaCard = mediaComponent.find(MediaCard);
			expect(mediaCard.prop('ssr')).toEqual(ssr);

			const card = mediaComponent.find(Card);
			expect(card.prop('mediaClientConfig')).toEqual(config);

			mediaComponent.unmount();
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
				const mediaCard = mountExternalCard(externalIdentifier, {
					alt: expectedAltText,
					allowAltTextOnImages: allowAltTextOnImages,
				});
				await act(async () => {
					await sleep(0);
				});

				const card = mediaCard.find(Card);
				expect(card.length).toEqual(1);
				expect(card.prop('alt')).toBe(expectedAltText);
				mediaCard.unmount();
			},
		);

		it('should pass shouldOpenMediaViewer=true if there is no onClick callback', () => {
			const cardWithOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" eventHandlers={{ media: { onClick: jest.fn() } }} />
				</MediaClientProvider>,
			);
			const cardWithoutOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" />
				</MediaClientProvider>,
			);

			expect(cardWithOnClick.find(Card).prop('shouldOpenMediaViewer')).toBeFalsy();
			expect(cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer')).toBeTruthy();
			cardWithOnClick.unmount();
			cardWithoutOnClick.unmount();
		});

		it('should pass shouldOpenMediaViewer=true if renderer appearance is not mobile', () => {
			const cardNoMobile = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" />
				</MediaClientProvider>,
			);

			expect(cardNoMobile.find(Card).prop('shouldOpenMediaViewer')).toBeTruthy();
			cardNoMobile.unmount();
		});

		it('should pass shouldOpenMediaViewer=true if property shouldOpenMediaViewer is set to true', () => {
			const cardWithOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard
						type="file"
						id="1"
						shouldOpenMediaViewer={true}
						eventHandlers={{ media: { onClick: jest.fn() } }}
					/>
				</MediaClientProvider>,
			);

			const cardWithoutOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" shouldOpenMediaViewer={true} />
				</MediaClientProvider>,
			);

			expect(cardWithOnClick.find(Card).prop('shouldOpenMediaViewer')).toBeTruthy();
			expect(cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer')).toBeTruthy();
			cardWithOnClick.unmount();
			cardWithoutOnClick.unmount();
		});

		it('should pass shouldOpenMediaViewer=false if property shouldOpenMediaViewer is set to false', () => {
			const cardWithOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard
						type="file"
						id="1"
						shouldOpenMediaViewer={false}
						eventHandlers={{ media: { onClick: jest.fn() } }}
					/>
				</MediaClientProvider>,
			);
			const cardWithoutOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" shouldOpenMediaViewer={false} />
				</MediaClientProvider>,
			);

			expect(cardWithOnClick.find(Card).prop('shouldOpenMediaViewer')).toBeFalsy();
			expect(cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer')).toBeFalsy();
			cardWithOnClick.unmount();
			cardWithoutOnClick.unmount();
		});

		it('should call passed onClick', () => {
			const onClick = jest.fn();
			const cardWithOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />
				</MediaClientProvider>,
			);

			const cardComponent = cardWithOnClick.find(Card);
			const event: CardEvent = {
				event: {} as any,
				mediaItemDetails: {
					id: 'some-id',
					mediaType: 'image',
				},
			};
			cardComponent.props().onClick!(event);
			expect(onClick).toHaveBeenCalledWith(event, undefined);
			cardWithOnClick.unmount();
		});

		it('should not call passed onClick when inline video is enabled and its a video file', () => {
			const onClick = jest.fn();
			const cardWithOnClick = mount(
				<MediaClientProvider clientConfig={mediaClientConfig}>
					<MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />
				</MediaClientProvider>,
			);

			const cardComponent = cardWithOnClick.find(Card);
			const event: CardEvent = {
				event: {} as any,
				mediaItemDetails: {
					id: 'some-id',
					mediaType: 'video',
				},
			};
			cardComponent.props().onClick!(event);
			expect(onClick).not.toHaveBeenCalled();
			cardWithOnClick.unmount();
		});
		// Skipped due to HOT-111922
		it.skip('should save fileState as a component state', async () => {
			const fileIdentifier = createFileIdentifier();
			const component = await mountFileCard(fileIdentifier);

			await act(async () => {
				await nextTick();
			});
			component.update();
			expect(mocks.mockMediaClient.file.getCurrentState).toBeCalled();
			expect(mocks.mockMediaClient.file.getCurrentState).toBeCalledWith(fileIdentifier.id, {
				collectionName: fileIdentifier.collectionName,
			});
			await nextTick();
			component.update();
			expect(component.find(MediaCardView).state('fileState')).toEqual({
				id: 'file-id',
				mediaType: 'image',
				name: 'file_name',
				status: 'processed',
			});
			component.unmount();
		});

		it('should save fileState when id changes', async () => {
			const fileIdentifier = createFileIdentifier();
			const component = await mountFileCard(fileIdentifier);

			await act(async () => {
				await nextTick();
			});
			component.update();

			component.setProps({
				id: '123',
			});

			await nextTick();
			component.update();
			expect(mocks.mockMediaClient.file.getCurrentState).toBeCalledTimes(2);
			component.unmount();
		});

		describe('populates identifier cache for the page mediaClientConfig', () => {
			it('should have a mediaViewerItems if doc is passed for a file card', async () => {
				const fileIdentifier = createFileIdentifier();
				const mediaFileCard = await mountFileCard(fileIdentifier);

				await act(async () => {
					await sleep(0);
				});
				mediaFileCard.update();

				expect(mediaFileCard.find(Card).at(0).props()).toHaveProperty('mediaViewerItems');
				expect(mediaFileCard.find(Card).at(0).props().mediaViewerItems).toEqual([fileIdentifier]);
				mediaFileCard.unmount();
			});

			it('should have a mediaViewerItems if doc is passed for an external card', async () => {
				const externalIdentifier = createExternalIdentifier();
				const mediaExternalCard = mountExternalCard(externalIdentifier);

				await act(async () => {
					await sleep(0);
				});

				mediaExternalCard.update();

				expect(mediaExternalCard.find(Card).at(0).props()).toHaveProperty('mediaViewerItems');
				expect(mediaExternalCard.find(Card).at(0).props().mediaViewerItems).toEqual([
					externalIdentifier,
				]);
				mediaExternalCard.unmount();
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

			it('should update the list on re-render if new external cards are added', async () => {
				const fileIdentifier = createFileIdentifier(1);
				const externalIdentifier = createExternalIdentifier(1);
				const mediaFileCard = await mountFileCard(fileIdentifier);

				await act(async () => {
					await jest.runAllTicks();
				});
				mediaFileCard.update();
				expect(mediaFileCard.find(Card).at(0).props().mediaViewerItems).toEqual([fileIdentifier]);

				const mediaExternalCard = mountExternalCard(externalIdentifier);
				await act(async () => {
					await jest.runAllTicks();
				});
				mediaExternalCard.update();
				expect(mediaExternalCard.find(Card).at(0).props().mediaViewerItems).toEqual([
					fileIdentifier,
					externalIdentifier,
				]);

				mediaFileCard.setProps({});
				expect(mediaFileCard.find(Card).at(0).props()).toHaveProperty('mediaViewerItems');
				expect(mediaFileCard.find(Card).at(0).props().mediaViewerItems).toEqual([
					fileIdentifier,
					externalIdentifier,
				]);
				mediaFileCard.unmount();
				mediaExternalCard.unmount();
			});

			it('should remove card from the list if a card is unmounted', async () => {
				const fileIdentifier0 = createFileIdentifier(2);
				const fileIdentifier1 = createFileIdentifier(3);
				const externalIdentifier0 = createExternalIdentifier(2);
				const externalIdentifier1 = createExternalIdentifier(3);
				const mediaFileCard0 = await mountFileCard(fileIdentifier0);
				const mediaFileCard1 = await mountFileCard(fileIdentifier1);
				const mediaExternalCard0 = mountExternalCard(externalIdentifier0);
				const mediaExternalCard1 = mountExternalCard(externalIdentifier1);

				await act(async () => {
					await sleep(0);
				});
				mediaFileCard0.update();
				mediaFileCard1.update();
				mediaExternalCard0.update();
				mediaExternalCard1.update();

				mediaFileCard0.unmount();
				mediaExternalCard1.unmount();

				mediaFileCard1.setProps({});
				mediaExternalCard0.setProps({});

				expect(mediaFileCard1.find(Card).at(0).props().mediaViewerItems).toEqual([
					fileIdentifier1,
					externalIdentifier0,
				]);
				expect(mediaExternalCard0.find(Card).at(0).props().mediaViewerItems).toEqual([
					fileIdentifier1,
					externalIdentifier0,
				]);

				mediaFileCard1.unmount();
				mediaExternalCard0.unmount();
			});
		});

		it('should add media attrs for copy and paste', async () => {
			const fileIdentifier = createFileIdentifier();
			const mediaFileCard = await mountFileCard(fileIdentifier);

			await act(async () => {
				await sleep();
			});
			mediaFileCard.update();
			expect(mediaFileCard.find('[data-node-type="media"]')).toHaveLength(1);
			expect(mediaFileCard.find('[data-node-type="media"]').props()).toEqual(
				expect.objectContaining({
					'data-context-id': undefined,
					'data-type': 'file',
					'data-node-type': 'media',
					'data-width': undefined,
					'data-height': undefined,
					'data-id': fileIdentifier.id,
					'data-collection': 'MediaServicesSample',
				}),
			);
			mediaFileCard.unmount();
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
			dataURI:
				'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
			mediaItemType: 'external-image',
			name: 'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
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
										url: 'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
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
										url: 'https://images.unsplash.com/photo-1553526665-dbfe3e8a6fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
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
		it('should render border mark with right color and size', () => {
			const mediaComponent = mount(
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

			const border = mediaComponent.find('div[data-mark-type="border"]');
			expect(border).toHaveLength(1);
			expect(getComputedStyle(border.getDOMNode()).getPropertyValue('box-shadow')).toContain('3px');
			expect(getComputedStyle(border.getDOMNode())).toHaveProperty('borderRadius', '3px');
		});
	});

	describe('Media Annotation Mark', () => {
		describe('when feature is disabled', () => {
			it('media comment badge does not render', () => {
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
						featureFlags={{ commentsOnMedia: false }}
					/>,
				);

				expect(result.container.querySelector('#foo')).toBeInTheDocument();
				expect(screen.queryByLabelText('View comments')).not.toBeInTheDocument();
			});
		});
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
						featureFlags={{ commentsOnMedia: true }}
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
						featureFlags={{ commentsOnMedia: true }}
					/>,
				);
				expect(result.container.querySelector('#foo')).not.toBeInTheDocument();
				expect(screen.queryByLabelText('View comments')).toBeInTheDocument();
			});
		});
	});

	describe('annotation attributes', () => {
		const dataAttributes = { 'data-node-type': 'media', 'data-renderer-start-pos': 4 };
		ffTest(
			'platform_editor_external_media_comment_bugfix',
			async () => {
				const externalIdentifier = createExternalIdentifier();
				const mediaExternalCard = mountExternalCard(externalIdentifier, { dataAttributes });

				await act(async () => {
					await sleep(0);
				});

				mediaExternalCard.update();

				expect(mediaExternalCard.childAt(0).html()).toContain('data-node-type="media"');
				expect(mediaExternalCard.childAt(0).html()).toContain('data-renderer-start-pos="4"');
			},
			async () => {
				const externalIdentifier = createExternalIdentifier();
				const mediaExternalCard = mountExternalCard(externalIdentifier, { dataAttributes });

				await act(async () => {
					await sleep(0);
				});

				mediaExternalCard.update();

				expect(mediaExternalCard.childAt(0).html()).not.toContain('data-node-type="media"');
				expect(mediaExternalCard.childAt(0).html()).not.toContain('data-renderer-start-pos="4"');
			},
		);
	});
});
