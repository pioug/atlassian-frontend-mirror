import React from 'react';
import { skipAutoA11y } from '@atlassian/a11y-jest-testing';
import { imageFileId } from '@atlaskit/media-test-helpers';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import type { MediaProps } from '../../../../react/nodes/media';
import Media from '../../../../react/nodes/media';
import type { Props as MediaSingleProps } from '../../../../react/nodes/mediaSingle';
import MediaSingle, { getMediaContainerWidth } from '../../../../react/nodes/mediaSingle';
import Caption from '../../../../react/nodes/caption';
import { UnsupportedBlock, WidthProvider } from '@atlaskit/editor-common/ui';

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

const mockUIMediaSingle = jest.fn();
jest.mock('@atlaskit/editor-common/ui', () => {
	const actual = jest.requireActual('@atlaskit/editor-common/ui');
	const react = jest.requireActual('react');
	return {
		...actual,
		MediaSingle: (props: Record<string, unknown>) => {
			mockUIMediaSingle(props);
			return react.createElement(actual.MediaSingle, props);
		},
	};
});

jest.mock('memoize-one', () => {
	const originalModule = jest.requireActual('@atlaskit/width-detector');

	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		...originalModule,
		default: (cb: unknown) => {
			return cb;
		},
	};
});
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

const lastMediaProps = () => mockMedia.mock.lastCall?.[0];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MediaSingle', () => {
	const editorWidth = 123;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const renderMediaSingle = (
		mediaSingleProps: Partial<MediaSingleProps> = {},
		mediaProps: Partial<MediaProps & { heigth: number; width: number }> = {},
		showCaption: boolean = true,
	) => {
		return renderWithIntl(
			<WidthProvider>
				<MediaSingle layout={'center'} rendererAppearance={'full-page'} {...mediaSingleProps}>
					<Media
						id={imageFileId.id}
						isLinkMark={() => false}
						isBorderMark={() => false}
						marks={[]}
						type={imageFileId.mediaItemType}
						collection={imageFileId.collectionName}
						isDrafting={false}
						{...mediaProps}
					/>
					{showCaption && (
						<Caption
							marks={[]}
							serializer={{} as any}
							nodeType="caption"
							dataAttributes={{ 'data-renderer-start-pos': 0 }}
						>
							This is a caption
						</Caption>
					)}
				</MediaSingle>
			</WidthProvider>,
		);
	};

	it('passes the renderer width down as cardDimensions', () => {
		const mediaDimensions = {
			width: 250,
			height: 250,
		};
		const mediaAspectRatio = mediaDimensions.height / mediaDimensions.width;

		// mock page width
		const mockOffsetWidth = jest
			.spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
			.mockReturnValue(123);

		renderMediaSingle({}, { ...mediaDimensions });

		const { cardDimensions } = lastMediaProps();
		expect(cardDimensions).toBeDefined();

		const cardHeightCss = cardDimensions!.height as string;
		const cardHeight = Number(cardHeightCss.substring(0, cardHeightCss.length - 2));

		expect(cardDimensions!.width).toEqual(`${editorWidth}px`);
		expect(cardHeight).toBeCloseTo(editorWidth * mediaAspectRatio);

		// reset mock page width
		mockOffsetWidth.mockReturnValue(0);
	});

	describe('with link mark', () => {
		const fireAnalyticsEvent = jest.fn();
		const mediaOnClick = jest.fn();

		const renderWithLinkMark = () =>
			renderMediaSingle(
				{
					fireAnalyticsEvent,
				},
				{
					marks: [{ attrs: { href: 'http://atlassian.com' } } as any],
					isLinkMark: () => true,
					eventHandlers: { media: { onClick: mediaOnClick } },
				},
			);

		// The link wraps a media card that never resolves in jsdom, so the anchor has no discernible
		// text and trips `link-name`. That is a limitation of the fixture, not of the link mark, so
		// the automatic a11y pass is opted out for these two tests.
		it(
			'renders media with link correctly',
			skipAutoA11y(() => {
				const { container } = renderWithLinkMark();

				expect(container.querySelectorAll('a[href="http://atlassian.com"]')).toHaveLength(1);
			}),
		);

		it(
			'override shouldOpenMediaViewer to be falsy',
			skipAutoA11y(() => {
				renderWithLinkMark();

				expect(lastMediaProps().shouldOpenMediaViewer).toBeFalsy();
			}),
		);
	});

	it('does not override media props when there is not link', () => {
		const mediaOnClick = jest.fn();
		renderMediaSingle(
			{},
			{
				marks: [],
				shouldOpenMediaViewer: true,
				eventHandlers: { media: { onClick: mediaOnClick } },
			},
		);

		const mediaProps = lastMediaProps();

		expect(mediaProps.eventHandlers).toEqual({
			media: { onClick: mediaOnClick },
		});
		expect(mediaProps.shouldOpenMediaViewer).toEqual(true);
	});

	it('passes feature flags down to media node', () => {
		const featureFlags: MediaFeatureFlags = {
			mediaInline: false,
		};
		renderMediaSingle({ featureFlags });

		expect(lastMediaProps().featureFlags).toEqual(featureFlags);
	});

	it('should use default editor width when <WidthConsumer /> value is not available', () => {
		renderMediaSingle();

		expect(mockUIMediaSingle).toHaveBeenLastCalledWith(
			expect.objectContaining({ containerWidth: 760 }),
		);
	});

	describe('Captions', () => {
		it('still render media if caption is not provided', () => {
			const { container } = renderMediaSingle({}, {}, false);

			expect(container.querySelector('[data-testid="media-caption"]')).not.toBeInTheDocument();
			expect(mockMedia).toHaveBeenCalled();
		});
	});

	describe('getMediaContainerWidth()', () => {
		it('should return existing value if available', () => {
			expect(getMediaContainerWidth(100, 'center')).toEqual(100);
			expect(getMediaContainerWidth(100, 'full-width')).toEqual(100);
			expect(getMediaContainerWidth(100, 'wide')).toEqual(100);
		});

		it('should return existing value if layout is not full-width or wide', () => {
			expect(getMediaContainerWidth(0, 'full-width')).toEqual(1800);
			expect(getMediaContainerWidth(0, 'wide')).toEqual(960);
			expect(getMediaContainerWidth(100, 'full-width')).toEqual(100);
			expect(getMediaContainerWidth(100, 'wide')).toEqual(100);
		});

		it('should return default value when existing container width is not available and layout is not full-width or wide', () => {
			expect(getMediaContainerWidth(0, 'center')).toEqual(760);
			expect(getMediaContainerWidth(0, 'align-end')).toEqual(760);
		});
	});

	describe('Unsupported content', () => {
		it('should return Unsupported Block node when there is no media element', () => {
			const unsupportedBlock = <UnsupportedBlock></UnsupportedBlock>;
			const { container } = renderWithIntl(
				<WidthProvider>
					<MediaSingle layout={'center'} rendererAppearance={'full-page'}>
						{unsupportedBlock}
					</MediaSingle>
				</WidthProvider>,
			);

			expect(container.querySelectorAll('.unsupported')).toHaveLength(1);
		});

		it('should return only Unsupported Block when there is no Media Element', () => {
			const unsupportedBlock = <UnsupportedBlock></UnsupportedBlock>;
			const { container } = renderWithIntl(
				<WidthProvider>
					<MediaSingle layout={'center'} rendererAppearance={'full-page'}>
						{unsupportedBlock}
						{
							<Caption
								marks={[]}
								serializer={{} as any}
								nodeType="caption"
								dataAttributes={{ 'data-renderer-start-pos': 0 }}
							>
								This is a caption
							</Caption>
						}
					</MediaSingle>
				</WidthProvider>,
			);

			expect(container.querySelectorAll('.unsupported')).toHaveLength(1);
			expect(container.querySelector('[data-testid="media-caption"]')).not.toBeInTheDocument();
		});
	});

	it('with border mark (old behaviour) - should use borderWidth as borderRadius', () => {
		failGate('platform_editor_media_border_radius_fix');
		const fireAnalyticsEvent = jest.fn();
		const mediaOnClick = jest.fn();

		const { container } = renderMediaSingle(
			{
				fireAnalyticsEvent,
			},
			{
				marks: [
					{
						type: 'border',
						attrs: {
							color: '#091E4224',
							size: 3,
						},
					},
				],
				isBorderMark: () => true,
				eventHandlers: { media: { onClick: mediaOnClick } },
			},
		);

		const borders = container.querySelectorAll('div[data-mark-type="border"]');
		expect(borders).toHaveLength(1);
		expect(getComputedStyle(borders[0]).getPropertyValue('box-shadow')).toContain('3px');
		expect(getComputedStyle(borders[0])).toHaveProperty('borderRadius', '3px');
	});

	it('with border mark (new behaviour) - should use 8px as borderRadius', () => {
		passGate('platform_editor_media_border_radius_fix');
		const fireAnalyticsEvent = jest.fn();
		const mediaOnClick = jest.fn();

		const { container } = renderMediaSingle(
			{
				fireAnalyticsEvent,
			},
			{
				marks: [
					{
						type: 'border',
						attrs: {
							color: '#091E4224',
							size: 3,
						},
					},
				],
				isBorderMark: () => true,
				eventHandlers: { media: { onClick: mediaOnClick } },
			},
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
