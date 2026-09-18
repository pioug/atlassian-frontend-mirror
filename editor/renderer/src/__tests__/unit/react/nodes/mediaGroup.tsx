const mockMedia = jest.fn();
jest.mock('../../../../react/nodes/media', () => {
	const actual = jest.requireActual('../../../../react/nodes/media');
	const react = jest.requireActual('react');
	return {
		__esModule: true,
		default: (props: Record<string, unknown>) => {
			mockMedia(props);
			return react.createElement(actual.default, props);
		},
	};
});

const mockCard = jest.fn();
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

import * as mocks from './media.mock';

import React from 'react';

import { act } from '@testing-library/react';
import * as sinon from 'sinon';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { defaultImageCardDimensions } from '@atlaskit/media-card/cardDimensions';
import type { CardEvent } from '@atlaskit/media-card/types';
import { MediaClientContext } from '@atlaskit/media-client-react/media-client-provider';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { imageFileId, genericFileId, nextTick } from '@atlaskit/media-test-helpers';

import Media from '../../../../react/nodes/media';
import MediaGroup from '../../../../react/nodes/mediaGroup';

const filmstrips = (container: HTMLElement) =>
	container.querySelectorAll('[data-testid="filmstrip-list-wrapper"]');

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MediaGroup', () => {
	const mediaProvider = storyMediaProviderFactory();

	const providerFactory = ProviderFactory.create({ mediaProvider });

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render media card with the right dimention if is a file', () => {
		renderWithIntl(
			<MediaGroup>
				<Media
					id={genericFileId.id}
					type={genericFileId.mediaItemType}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={genericFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(mockMedia).toHaveBeenLastCalledWith(
			expect.objectContaining({ cardDimensions: defaultImageCardDimensions }),
		);
	});

	it('should not render a FilmstripView component if it has only one media node', () => {
		const { container } = renderWithIntl(
			<MediaGroup>
				<Media
					id={imageFileId.id}
					type={imageFileId.mediaItemType}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(filmstrips(container)).toHaveLength(0);
	});

	it('should render a FilmstripView component if it has more than one media node', () => {
		const { container } = renderWithIntl(
			<MediaGroup>
				<Media
					id={imageFileId.id}
					type={imageFileId.mediaItemType}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
				<Media
					id={imageFileId.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					type={imageFileId.mediaItemType}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(filmstrips(container)).toHaveLength(1);
	});

	it('should call onClick with all the items in a media group', async () => {
		const onClick = sinon.spy() as any;
		const eventHandlers = {
			media: { onClick },
		} as EventHandlers;
		const { container } = renderWithIntl(
			<MediaClientContext.Provider value={mocks.mockMediaClient}>
				<MediaGroup eventHandlers={eventHandlers}>
					<Media
						id={imageFileId.id}
						type={imageFileId.mediaItemType}
						occurrenceKey="001"
						marks={[]}
						isLinkMark={() => false}
						isBorderMark={() => false}
						collection={imageFileId.collectionName}
						providers={providerFactory}
						isDrafting={false}
					/>
					<Media
						id={imageFileId.id}
						type={imageFileId.mediaItemType}
						occurrenceKey="001"
						marks={[]}
						isLinkMark={() => false}
						isBorderMark={() => false}
						collection={imageFileId.collectionName}
						providers={providerFactory}
						isDrafting={false}
					/>
				</MediaGroup>
			</MediaClientContext.Provider>,
		);

		expect(filmstrips(container)).toHaveLength(1);

		await act(async () => {
			await mediaProvider;
		});
		await nextTick();

		// the first card rendered inside the filmstrip belongs to the first media node
		expect(mockCard).toHaveBeenCalled();
		mockCard.mock.calls[0][0].onClick({} as CardEvent);

		expect(onClick.callCount).toBe(1);
		expect(onClick.lastCall.args.length).toBeGreaterThan(1);

		const surroundingItems = onClick.lastCall.args[1].list;
		expect(surroundingItems.length).toBe(2);

		expect(surroundingItems[0].id).toBe(imageFileId.id);
		expect(surroundingItems[0].mediaItemType).toBe(imageFileId.mediaItemType);
		expect(surroundingItems[0].collectionName).toBe(imageFileId.collectionName);
		expect(surroundingItems[0].occurrenceKey).toBe('001');
	});

	it('should send useInlinePlayer: false to the Media', () => {
		renderWithIntl(
			<MediaGroup>
				<Media
					id={imageFileId.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					type={imageFileId.mediaItemType}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(mockMedia).toHaveBeenLastCalledWith(expect.objectContaining({ useInlinePlayer: false }));
	});

	it('should pass onClick callback only if eventHandlers.media.onClick its defined', () => {
		renderWithIntl(
			<MediaGroup>
				<Media
					id={imageFileId.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					type={imageFileId.mediaItemType}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
				<Media
					id={imageFileId.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					type={imageFileId.mediaItemType}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(mockMedia).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ eventHandlers: { media: { onClick: undefined } } }),
		);

		mockMedia.mockClear();

		renderWithIntl(
			<MediaGroup eventHandlers={{ media: { onClick: jest.fn() } }}>
				<Media
					id={imageFileId.id}
					type={imageFileId.mediaItemType}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
				<Media
					id={imageFileId.id}
					type={imageFileId.mediaItemType}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(mockMedia).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ eventHandlers: { media: { onClick: expect.any(Function) } } }),
		);
	});

	it('should pass feature flags to MediaCardInternal', () => {
		const featureFlags: MediaFeatureFlags = {};
		renderWithIntl(
			<MediaGroup featureFlags={featureFlags}>
				<Media
					id={imageFileId.id}
					marks={[]}
					isLinkMark={() => false}
					isBorderMark={() => false}
					type={imageFileId.mediaItemType}
					collection={imageFileId.collectionName}
					isDrafting={false}
				/>
			</MediaGroup>,
		);

		expect(mockMedia).toHaveBeenLastCalledWith(expect.objectContaining({ featureFlags }));
	});

	it('should render unsupported content if there is unsupported content', () => {
		const { container } = renderWithIntl(
			<MediaGroup>
				<UnsupportedBlock />
			</MediaGroup>,
		);

		expect(container.querySelectorAll('.unsupported')).toHaveLength(1);
	});

	describe('enableDownloadButton', () => {
		const renderMediaGroup = (enableDownloadButton: boolean) =>
			renderWithIntl(
				<MediaGroup enableDownloadButton={enableDownloadButton}>
					<Media
						id={imageFileId.id}
						marks={[]}
						isLinkMark={() => false}
						isBorderMark={() => false}
						type={imageFileId.mediaItemType}
						collection={imageFileId.collectionName}
						isDrafting={false}
					/>
				</MediaGroup>,
			);

		it('should enable download button when enableDownloadButton is true', () => {
			renderMediaGroup(true);

			expect(mockMedia).toHaveBeenLastCalledWith(
				expect.objectContaining({ enableDownloadButton: true }),
			);
		});

		it('should not enable download button when enableDownloadButton is false', () => {
			renderMediaGroup(false);

			expect(mockMedia).toHaveBeenLastCalledWith(
				expect.objectContaining({ enableDownloadButton: false }),
			);
		});
	});
});
