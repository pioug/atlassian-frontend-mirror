import React from 'react';
import Loadable from 'react-loadable';
import { waitFor, cleanup, screen, fireEvent } from '@testing-library/react';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockEmojiResource } from '@atlaskit/util-data-test/mock-emoji-resource';

import { type EmojiDescription, UfoEmojiTimings } from '../../../../types';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import type { EmojiProvider } from '../../../../api/EmojiResource';

import { evilburnsEmoji, grinEmoji, getEmojiResourcePromise, mediaEmoji } from '../../_test-data';

import { ufoExperiences } from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import * as samplingUfo from '../../../../util/analytics/samplingUfo';
import browserSupport from '../../../../util/browser-support';
import type { EmojiId } from '../../../..';
import { renderWithIntl } from '../../_testing-library';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('../../../../util/constants', () => {
	const originalModule = jest.requireActual('../../../../util/constants');
	return {
		...originalModule,
		SAMPLING_RATE_EMOJI_RENDERED_EXP: 1,
	};
});

const mockConstants = constants as {
	SAMPLING_RATE_EMOJI_RENDERED_EXP: number;
};

Loadable.preloadAll();

describe('<ResourcedEmoji />', () => {
	describe('if enabled, should only use optimisticImageURL if set for page title emoji', () => {
		ffTest(
			'platform_emoji_prevent_img_src_changing',
			async () => {
				const optSrc = 'https://opt.example/emoji.png';
				let resolveEmoji: (value: any) => void;
				const provider: Partial<EmojiProvider> = {
					fetchByEmojiId: () =>
						new Promise((resolve) => {
							resolveEmoji = resolve;
						}),
				};
				renderWithIntl(
					<ResourcedEmoji
						pageTitleEmoji={true}
						emojiProvider={Promise.resolve(provider as EmojiProvider)}
						emojiId={{ id: grinEmoji.id, shortName: grinEmoji.shortName }}
						optimisticImageURL={optSrc}
						fitToHeight={40}
					/>,
				);
				// Initially renders optimistic image
				let img = await screen.findByAltText(grinEmoji.shortName);
				expect(img).toHaveAttribute('src', expect.stringContaining(optSrc));
				// Wait until fetchByEmojiId has been invoked and we captured the resolver
				await waitFor(() => expect(typeof resolveEmoji).toBe('function'));
				// Now resolve the emoji and ensure we still render optimistic src
				resolveEmoji!({
					id: grinEmoji.id!,
					shortName: grinEmoji.shortName,
					fallback: grinEmoji.fallback,
					type: grinEmoji.type,
					category: grinEmoji.category,
					searchable: true,
					altRepresentation: {
						mediaPath: 'real-sync.png',
						width: 64,
						height: 64,
					},
					representation: {
						mediaPath: 'real-sync.png',
						width: 32,
						height: 32,
					},
				});
				await waitFor(() => {
					img = screen.getByAltText(grinEmoji.shortName);
					expect(img).toHaveAttribute('src', expect.stringContaining(optSrc));
				});
			},
			async () => {
				// FG OFF: start with optimisticImageURL, then when emoji resolves, it should swap to the real src
				const optSrc = 'https://opt.example/emoji.png';
				let resolveEmojiOff: (value: any) => void;
				const provider: Partial<EmojiProvider> = {
					fetchByEmojiId: () =>
						new Promise((resolve) => {
							resolveEmojiOff = resolve;
						}),
				};
				renderWithIntl(
					<ResourcedEmoji
						emojiProvider={Promise.resolve(provider as EmojiProvider)}
						emojiId={{ id: grinEmoji.id, shortName: grinEmoji.shortName }}
						optimisticImageURL={optSrc}
						fitToHeight={40}
						pageTitleEmoji={true}
					/>,
				);
				// Initially optimistic src is rendered
				let img = await screen.findByAltText(grinEmoji.shortName);
				expect(img).toHaveAttribute('src', expect.stringContaining(optSrc));
				// Wait until fetchByEmojiId has been invoked and we captured the resolver
				await waitFor(() => expect(typeof resolveEmojiOff).toBe('function'));
				resolveEmojiOff!({
					id: grinEmoji.id!,
					shortName: grinEmoji.shortName,
					fallback: grinEmoji.fallback,
					type: grinEmoji.type,
					category: grinEmoji.category,
					searchable: true,
					altRepresentation: {
						mediaPath: 'real-sync.png',
						width: 64,
						height: 64,
					},
					representation: {
						mediaPath: 'real-sync.png',
						width: 32,
						height: 32,
					},
				});
				await waitFor(() => {
					img = screen.getByAltText(grinEmoji.shortName);
					expect(img).toHaveAttribute('src', expect.stringContaining('real-sync.png'));
				});
			},
		);
	});
	beforeAll(() => {
		browserSupport.supportsIntersectionObserver = true;
	});

	beforeEach(() => {
		mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP = 1;
		samplingUfo.clearSampled();
		jest.clearAllMocks();
	});
	afterEach(cleanup);

	describe('has an unresolved emoji provider', () => {
		it('shows ResourcedEmojiComponent placeholder', async () => {
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise()}
					emojiId={{ shortName: 'does-not-exist', id: 'does-not-exist' }}
				/>,
			);
			const label = screen.queryByLabelText('does-not-exist');
			expect(label).toBeInTheDocument();
			expect(screen.queryByTestId('emoji-placeholder-does-not-exist')).toBeInTheDocument();
		});
		it('shows optimistic image when provided', async () => {
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise()}
					emojiId={{ shortName: 'does-not-exist', id: 'does-not-exist' }}
					optimisticImageURL="foo.jpg"
				/>,
			);
			const image = screen.queryByAltText('does-not-exist');
			expect(image).toBeInTheDocument();
			expect(image?.getAttribute('src')).toEqual('foo.jpg');
		});
		it('shows placeholder when optimistic image is null', async () => {
			const optimiticImageApi = {
				getUrl: (_: EmojiId) => undefined,
			};
			const emoji = { shortName: 'emoji-exists', id: 'emoji-exists' };
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise()}
					emojiId={emoji}
					optimisticImageURL={optimiticImageApi?.getUrl(emoji)}
				/>,
			);
			expect(screen.queryByLabelText('emoji-exists')).toBeInTheDocument();
			expect(screen.queryByTestId('emoji-placeholder-emoji-exists')).toBeInTheDocument();
		});
	});

	describe('has a resolved instance of emoji provider', () => {
		it('should render an emoji', async () => {
			const resolvedEmojiProvider = await getEmojiResourcePromise();
			renderWithIntl(
				<ResourcedEmoji emojiProvider={resolvedEmojiProvider} emojiId={{ ...grinEmoji }} />,
			);
			const emoji = await screen.findByTestId(`sprite-emoji-${grinEmoji.shortName}`);
			expect(emoji).toBeInTheDocument();
		});
	});

	it('should render a fallback element if emoji cannot be found', async () => {
		const fallback = <h1>wow cool</h1>;
		const component = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: 'does-not-exist', id: 'does-not-exist' }}
				customFallback={fallback}
			/>,
		);

		await waitFor(async () => {
			const result = await component.findByText('wow cool');
			expect(result).toBeInTheDocument();
		});
	});

	it('should render a fallback string if emoji cannot be found', async () => {
		const component = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: 'does-not-exist', id: 'does-not-exist' }}
				customFallback="wow cool"
			/>,
		);

		await waitFor(async () => {
			const result = await component.findByText('wow cool');
			expect(result).toBeInTheDocument();
		});
	});

	it('should render emoji', async () => {
		const { container } = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
			/>,
		);

		const emoji = container.querySelector(`[data-emoji-id*="${grinEmoji.id}"]`);
		expect(emoji).toBeInTheDocument();
	});

	it('should render emoji with correct data attributes', async () => {
		const { container } = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
			/>,
		);

		const emoji = container.querySelector(`[data-emoji-id*="${grinEmoji.id}"]`); // we want the span around the emoji
		expect(emoji).toHaveAttribute('data-emoji-id', grinEmoji.id);
		expect(emoji).toHaveAttribute('data-emoji-short-name', 'shouldnotbeused');
		expect(emoji).toHaveAttribute('data-emoji-text', 'shouldnotbeused');
	});

	it('should not wrap with a tooltip if there is no showTooltip prop', async () => {
		const result = renderWithIntl(
			<ResourcedEmoji emojiProvider={getEmojiResourcePromise()} emojiId={grinEmoji} />,
		);

		mockAllIsIntersecting(true);

		const component = await result.findByTestId(`sprite-emoji-${grinEmoji.shortName}`);
		expect(component).not.toHaveAttribute('title');
	});

	it('should wrap with tooltip if showTooltip is set to true', async () => {
		const result = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={grinEmoji}
				showTooltip={true}
			/>,
		);
		mockAllIsIntersecting(true);
		const component = await result.findByTestId(`sprite-emoji-${grinEmoji.shortName}`);
		expect(component).toHaveAttribute('title', ':grin:');
	});

	it('should fallback to shortName if no id', async () => {
		const { container } = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: grinEmoji.shortName }}
			/>,
		);

		await screen.findByRole('img'); // wait for emoji to load
		const emoji = container.querySelector('.emoji-common-emoji-sprite');
		expect(emoji).toHaveStyle('background-position: 8.333333333333332% 0%'); // position corresponding to grin emoji
	});

	it('should update emoji on shortName change', async () => {
		const { rerender } = renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: grinEmoji.shortName }}
			/>,
		);
		expect(await screen.findByTestId(`sprite-emoji-${grinEmoji.shortName}`)).toBeInTheDocument();

		rerender(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise()}
				emojiId={{ shortName: evilburnsEmoji.shortName }}
			/>,
		);
		expect(
			await screen.findByTestId(`image-emoji-${evilburnsEmoji.shortName}`),
		).toBeInTheDocument();
	});

	it('unknown emoji', () => {
		let resolver: (value?: any | PromiseLike<any>) => void;
		const config = {
			promiseBuilder: (result: EmojiDescription) => {
				return new Promise((resolve) => {
					resolver = resolve;
				});
			},
		};
		renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise(config) as Promise<EmojiProvider>}
				emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
			/>,
		);

		return waitUntil(() => !!resolver).then(() => {
			resolver();
			expect(screen.getByTestId('emoji-placeholder-doesnotexist')).toBeInTheDocument();
		});
	});

	it('placeholder while loading emoji', async () => {
		let resolver: (value?: any | PromiseLike<any>) => void;
		let resolverResult: EmojiDescription;
		const config = {
			promiseBuilder: (result: EmojiDescription) => {
				resolverResult = result;
				return new Promise((resolve) => {
					resolver = resolve;
				});
			},
		};
		renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise(config) as Promise<EmojiProvider>}
				emojiId={{ shortName: grinEmoji.shortName, id: grinEmoji.id }}
			/>,
		);

		await waitFor(() => !!resolver);
		expect(
			await screen.findByTestId(`emoji-placeholder-${grinEmoji.shortName}`),
		).toBeInTheDocument();
		await waitFor(() => {
			resolver(resolverResult);
		});
		expect(await screen.findByTestId(`sprite-emoji-${grinEmoji.shortName}`)).toBeInTheDocument();
	});

	it('placeholder should be wrapped with a tooltip if showTooltip is set to true', async () => {
		// @ts-ignore Unused var never read, should this be deleted?
		let resolver;
		// @ts-ignore Unused var never read, should this be deleted?
		let resolverResult;
		const config = {
			promiseBuilder: (result: EmojiDescription) => {
				resolverResult = result;
				return new Promise((resolve) => {
					resolver = resolve;
				});
			},
		};
		renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise(config) as Promise<EmojiProvider>}
				emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
				showTooltip={true}
			/>,
		);

		const placeholder = await screen.findByTestId('emoji-placeholder-doesnotexist');
		expect(placeholder).toHaveAttribute('title', 'doesnotexist');
	});

	describe('should update ufo experience', () => {
		it('and mark success for UFO experience of rendered emoji event when emoji is loaded when in view at start', async () => {
			const experience = ufoExperiences['emoji-rendered'].getInstance(
				mediaEmoji.id || mediaEmoji.shortName,
			);
			const startSpy = jest.spyOn(experience, 'start');
			const successSpy = jest.spyOn(experience, 'success');
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
				/>,
			);

			const emoji = await screen.findByAltText('Media example');
			// mimic image loaded first when it's in viewport at start
			mockAllIsIntersecting(false);
			fireEvent.load(emoji);
			// detected emoji is in viewport
			mockAllIsIntersecting(true);
			expect(startSpy).toHaveBeenCalledTimes(1);
			expect(successSpy).toHaveBeenCalledTimes(1);
			expect(
				experience.metrics.marks.some((mark) => mark.name === UfoEmojiTimings.ONLOAD_END),
			).toBeTruthy();
		});

		it('and mark success for UFO experience of rendered emoji event when emoji is loaded after in viewport', async () => {
			const timeBeforeInView = 500;
			mockAllIsIntersecting(false);
			const experience = ufoExperiences['emoji-rendered'].getInstance(
				mediaEmoji.id || mediaEmoji.shortName,
			);
			const startSpy = jest.spyOn(experience, 'start');
			const successSpy = jest.spyOn(experience, 'success');
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
				/>,
			);

			const emoji = await screen.findByAltText('Media example');
			// mimic user waited some time and then scroll to get emoji in viewport
			await new Promise((r) => setTimeout(r, timeBeforeInView));
			mockAllIsIntersecting(true);
			// emoji in view port and load image
			fireEvent.load(emoji);
			const onLoadEndTime = experience.metrics.marks.find(
				(mark) => mark.name === UfoEmojiTimings.ONLOAD_END,
			);
			const onLoadStartTime = experience.metrics.marks.find(
				(mark) => mark.name === UfoEmojiTimings.ONLOAD_START,
			);
			expect(startSpy).toHaveBeenCalledTimes(1);
			expect(successSpy).toHaveBeenCalledTimes(1);
			expect(onLoadEndTime).toBeDefined();
			expect(onLoadStartTime).toBeDefined();
			expect(onLoadEndTime!.time - onLoadStartTime!.time).toBeLessThan(timeBeforeInView);
			expect(
				experience.metrics.marks.find((mark) => mark.name === UfoEmojiTimings.ONLOAD_END),
			).toBeTruthy();
		});

		it('and mark failure for UFO experience of rendered emoji event when emoji is on error', async () => {
			const experience = ufoExperiences['emoji-rendered'].getInstance(
				mediaEmoji.id || mediaEmoji.shortName,
			);
			const startSpy = jest.spyOn(experience, 'start');
			const failSpy = jest.spyOn(experience, 'failure');
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
				/>,
			);

			const emoji = await screen.findByAltText('Media example');
			mockAllIsIntersecting(true);
			fireEvent.error(emoji);
			expect(startSpy).toHaveBeenCalledTimes(1);
			expect(failSpy).toHaveBeenCalledTimes(1);
		});

		it('and fail UFO experience of rendered emoji event when emoji have rendering issues', async () => {
			// cause a rendering issue by throwing an error when finding an emoji
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'fetchByEmojiId')
				.mockImplementation(() => Promise.reject(new Error('test error')));
			const experience = ufoExperiences['emoji-rendered'].getInstance(
				mediaEmoji.id || mediaEmoji.shortName,
			);
			const startSpy = jest.spyOn(experience, 'start');
			const failureSpy = jest.spyOn(experience, 'failure');

			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
				/>,
			);

			await waitFor(() => expect(startSpy).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(failureSpy).toHaveBeenCalledTimes(1));
			spy.mockRestore();
		});

		it('and abort UFO experience of rendered emoji event when emoji is unmounted', () => {
			const experience = ufoExperiences['emoji-rendered'].getInstance(
				mediaEmoji.id || mediaEmoji.shortName,
			);
			const startSpy = jest.spyOn(experience, 'start');
			const abortSpy = jest.spyOn(experience, 'abort');
			const component = renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
				/>,
			);

			component.unmount();

			expect(startSpy).toHaveBeenCalledTimes(1);
			expect(abortSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('should trigger passed in callback props', () => {
		it('and call onEmojiLoadSuccess if it is defined on a successful load', async () => {
			const mockOnEmojiLoadSuccess = jest.fn();
			const timeBeforeInView = 500;
			mockAllIsIntersecting(false);
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
					onEmojiLoadSuccess={mockOnEmojiLoadSuccess}
				/>,
			);

			const emoji = await screen.findByAltText('Media example');
			// mimic user waited some time and then scroll to get emoji in viewport
			await new Promise((r) => setTimeout(r, timeBeforeInView));
			mockAllIsIntersecting(true);
			// emoji in view port and load image
			fireEvent.load(emoji);

			expect(mockOnEmojiLoadSuccess).toHaveBeenCalled();
		});

		it('and call onEmojiLoadFail if it is defined when emoji fails to load', async () => {
			const mockOnEmojiLoadFail = jest.fn();
			mockAllIsIntersecting(false);
			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
					onEmojiLoadFail={mockOnEmojiLoadFail}
				/>,
			);

			const emoji = await screen.findByAltText('Media example');
			mockAllIsIntersecting(true);
			fireEvent.error(emoji);

			expect(mockOnEmojiLoadFail).toHaveBeenCalled();
		});

		it('and call onEmojiLoadFail if it is defined when emoji has a rendering issue', async () => {
			const mockOnEmojiLoadFail = jest.fn();
			// cause a rendering issue by throwing an error when finding an emoji
			const spy = jest
				.spyOn(MockEmojiResource.prototype, 'fetchByEmojiId')
				.mockImplementation(() => Promise.reject(new Error('test error')));

			renderWithIntl(
				<ResourcedEmoji
					emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
					emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
					onEmojiLoadFail={mockOnEmojiLoadFail}
				/>,
			);

			await waitFor(() => expect(mockOnEmojiLoadFail).toHaveBeenCalled());

			spy.mockRestore();
		});
	});

	it('should automatically set width to auto if fitToHeight is true', async () => {
		renderWithIntl(
			<ResourcedEmoji
				emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
				emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
				fitToHeight={40}
			/>,
		);
		const image = await screen.findByAltText('Media example');
		expect(image).toHaveAttribute('width', 'auto');
		expect(image).toHaveAttribute('height', '40');
	});
});
