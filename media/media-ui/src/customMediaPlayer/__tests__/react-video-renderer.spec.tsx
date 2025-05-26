import React from 'react';
import { render, fireEvent, RenderResult, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Video, {
	VideoProps,
	RenderCallback,
	VideoState,
	SourceElement,
	type VideoActions,
} from '../react-video-renderer';

type RenderVideoReturn = RenderResult & {
	children: jest.Mock<ReturnType<RenderCallback>, Parameters<RenderCallback>>;
	elem: HTMLVideoElement | HTMLAudioElement;
	actions: VideoActions;
	state: () => Parameters<RenderCallback>[1];
	ref: () => Parameters<RenderCallback>[3];
	reactElem: () => Parameters<RenderCallback>[0];
};

const setup = (props: Partial<VideoProps> = {}): RenderVideoReturn => {
	const children = jest.fn().mockImplementation((video) => video) as jest.Mock<
		ReturnType<RenderCallback>,
		Parameters<RenderCallback>
	>;

	const utils = render(
		<Video src="video-url" {...props}>
			{children}
		</Video>,
	);

	const type = props.sourceType === 'audio' ? 'audio' : 'video';
	const elem = utils.container.querySelector(type)! as HTMLVideoElement | HTMLAudioElement;
	Object.defineProperty(elem, 'duration', {
		writable: true,
		value: elem.duration,
	});

	const latestChild = () => children.mock.calls[children.mock.calls.length - 1];
	const state = () => latestChild()[1];
	const ref = () => latestChild()[3];
	const reactElem = () => latestChild()[0];
	const actions = children.mock.calls[0][2];

	return { ...utils, children, elem, actions, state, ref, reactElem };
};

describe('VideoRenderer', () => {
	const playFunc = window.HTMLMediaElement.prototype.play;
	const pauseFunc = window.HTMLMediaElement.prototype.pause;
	beforeAll(() => {
		window.HTMLMediaElement.prototype.play = () => Promise.resolve();
		window.HTMLMediaElement.prototype.pause = () => {};
	});
	afterAll(() => {
		window.HTMLMediaElement.prototype.play = playFunc;
		window.HTMLMediaElement.prototype.pause = pauseFunc;
	});
	describe('element', () => {
		it.each(['video', 'audio'] as const)(
			'should create a %s element with the right properties',
			(sourceType) => {
				const { reactElem: reactElem1 } = setup({ sourceType, src: 'first-url' });
				expect(reactElem1().props).toEqual(
					expect.objectContaining({
						src: 'first-url',
						preload: 'metadata',
						autoPlay: false,
						controls: false,
					}),
				);

				const { reactElem: reactElem2, ref } = setup({
					src: 'some-src',
					preload: 'none',
					autoPlay: true,
					controls: true,
				});
				expect(reactElem2().props).toEqual(
					expect.objectContaining({
						src: 'some-src',
						preload: 'none',
						autoPlay: true,
						controls: true,
					}),
				);

				expect(ref().current).toEqual(
					expect.objectContaining<Partial<SourceElement>>({
						currentTime: 0,
					}),
				);
			},
		);

		it.each(['video', 'audio'] as const)(
			'should play new src at the current time when src changes and %s is not paused',
			(sourceType) => {
				const { rerender, elem, state } = setup({ sourceType });

				fireEvent.timeUpdate(elem, { target: { currentTime: 10 } });
				fireEvent.play(elem);
				rerender(
					<Video src="new-src" sourceType={sourceType}>
						{(videoEl) => videoEl}
					</Video>,
				);

				expect(elem).toHaveProperty('src', expect.stringMatching('new-src'));
				expect(state().currentTime).toBe(10);
			},
		);

		it.each(['video', 'audio'] as const)(
			'should start playing from defaultTime point if provided for %s',
			(sourceType) => {
				const { ref, elem } = setup({ defaultTime: 10, sourceType });

				fireEvent.loadedData(elem);

				expect(ref().current!.currentTime).toBe(10);
			},
		);
	});

	describe('state', () => {
		const initialState: Omit<VideoState, 'currentActiveCues'> = {
			currentTime: 0,
			volume: 1,
			status: 'paused',
			isMuted: false,
			isLoading: true,
			duration: 0,
			buffered: 0,
		};

		it.each(['video', 'audio'] as const)('returns initial state for %s', (sourceType) => {
			const { state } = setup({ sourceType });
			expect(state()).toEqual({
				...initialState,
				currentActiveCues: expect.any(Function),
			});
		});

		it.each(['video', 'audio'] as const)(
			'should return correct state when %s is ready to play',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });
				act(() => {
					fireEvent.canPlay(elem, {
						target: {
							currentTime: 1,
							volume: 0.5,
							duration: 25,
						},
					});
				});

				expect(state()).toEqual({
					...initialState,
					currentTime: 1,
					volume: 0.5,
					isLoading: false,
					duration: 25,
					currentActiveCues: expect.any(Function),
				});
			},
		);

		it.each(['video', 'audio'] as const)(
			'should return the current time whenever time changes for %s',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });

				fireEvent.timeUpdate(elem, { target: { currentTime: 1 } });

				expect(state()).toEqual({
					...initialState,
					currentTime: 1,
					currentActiveCues: expect.any(Function),
				});
			},
		);

		it.each(['video', 'audio'] as const)(
			'should return volume value on change for %s',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });

				act(() => {
					fireEvent.volumeChange(elem, { target: { volume: 0.5 } });
				});
				expect(state()).toEqual({
					...initialState,
					volume: 0.5,
					currentActiveCues: expect.any(Function),
				});
			},
		);

		it.each(['video', 'audio'] as const)(
			'should reset duration when %s duration changes',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });

				fireEvent.durationChange(elem, { target: { duration: 10 } });

				expect(state()).toEqual({
					...initialState,
					duration: 10,
					currentActiveCues: expect.any(Function),
				});
			},
		);

		it.each(['video', 'audio'] as const)(
			'should return error status when the %s is errored',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });

				fireEvent.error(elem);

				expect(state().status).toEqual('errored');
				expect(state().isLoading).toEqual(false);
			},
		);

		it.each(['video', 'audio'] as const)(
			'should return right value for isMuted state for %s',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });

				act(() => {
					fireEvent.canPlay(elem, {
						target: {
							currentTime: 1,
							currentActiveCues: expect.any(Function),
							volume: 0,
							duration: 2,
						},
					});
				});

				expect(state()).toEqual({
					...initialState,
					currentTime: 1,
					currentActiveCues: expect.any(Function),
					volume: 0,
					duration: 2,
					isMuted: true,
					isLoading: false,
				});

				act(() => {
					fireEvent.volumeChange(elem, { target: { volume: 0.1 } });
				});

				expect(state()).toEqual({
					...initialState,
					currentTime: 1,
					currentActiveCues: expect.any(Function),
					volume: 0.1,
					duration: 2,
					isMuted: false,
					isLoading: false,
				});
			},
		);

		it.each(['video', 'audio'] as const)(
			'should set loading state when %s is waiting',
			(sourceType) => {
				const { state, elem } = setup({ sourceType });

				fireEvent.waiting(elem);
				expect(state().isLoading).toEqual(true);
				fireEvent.canPlay(elem);
				expect(state().isLoading).toEqual(false);
			},
		);
	});

	describe('actions', () => {
		it('should set video current time to passed time when navigate is called', () => {
			const { actions, children } = setup();
			act(() => actions.navigate(10));
			const expectedState: Partial<VideoState> = {
				currentTime: 10,
			};
			expect(children).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining(expectedState),
				expect.anything(),
				expect.anything(),
			);
		});

		it('should set audio current time to passed time when navigate is called', () => {
			const { state, actions } = setup({ sourceType: 'audio' });
			act(() => {
				actions.navigate(10);
			});
			expect(state().currentTime).toEqual(10);
		});

		it('should play the video when play action is called', () => {
			const { actions, ref } = setup();
			const videoElement = ref().current;
			if (!videoElement) {
				return expect(videoElement).toBeDefined();
			}
			const playSpy = jest.spyOn(videoElement, 'play');
			act(() => {
				actions.play();
			});
			expect(playSpy).toHaveBeenCalled();
		});

		it('should pause the video when pause action is called', () => {
			const { actions, ref } = setup();
			const videoElement = ref().current;
			if (!videoElement) {
				return expect(videoElement).toBeDefined();
			}
			const pauseSpy = jest.spyOn(videoElement, 'pause');
			act(() => {
				actions.pause();
			});
			expect(pauseSpy).toHaveBeenCalled();
		});

		it('should change video volume when setVolume is called', () => {
			const { children, actions } = setup({ sourceType: 'audio' });

			act(() => {
				actions.setVolume(0.1);
			});

			const expectedState: Partial<VideoState> = {
				volume: 0.1,
			};

			expect(children).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining(expectedState),
				expect.anything(),
				expect.anything(),
			);
		});

		it('should change audio volume when setVolume is called', () => {
			const { children, actions } = setup({ sourceType: 'audio' });

			act(() => {
				actions.setVolume(0.1);
			});

			const expectedState: Partial<VideoState> = {
				volume: 0.1,
			};

			expect(children).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining(expectedState),
				expect.anything(),
				expect.anything(),
			);
		});

		it('should use previous volume value when unmute video', () => {
			const { children, actions } = setup({ sourceType: 'audio' });

			act(() => {
				actions.setVolume(0.3);
			});
			act(() => {
				actions.mute();
			});
			let expectedState: Partial<VideoState> = {
				volume: 0,
			};
			expect(children).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining(expectedState),
				expect.anything(),
				expect.anything(),
			);
			act(() => {
				actions.unmute();
			});
			expectedState = {
				volume: 0.3,
			};
			expect(children).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining(expectedState),
				expect.anything(),
				expect.anything(),
			);
		});

		it('should change playback speed when setPlaybackSpeed is called', () => {
			const { actions, ref } = setup({ sourceType: 'video' });
			const videoElement = ref().current;
			if (!videoElement) {
				return expect(videoElement).toBeDefined();
			}
			act(() => {
				actions.setPlaybackSpeed(1.5);
			});
			expect(videoElement.playbackRate).toEqual(1.5);
		});
	});

	describe('ref', () => {
		it('should pass dom video ref to render callback', () => {
			const { ref } = setup();
			expect(ref().current).toBeInstanceOf(HTMLVideoElement);
		});

		it('should pass dom audio ref to render callback', () => {
			const { ref } = setup({ sourceType: 'audio' });
			expect(ref().current).toBeInstanceOf(HTMLAudioElement);
		});
	});

	describe('public events', () => {
		it('should raise onCanPlay prop with event when media played', () => {
			const onCanPlay = jest.fn();
			const { elem } = setup({
				onCanPlay,
			});

			fireEvent.canPlay(elem);
			expect(onCanPlay).toHaveBeenCalled();
		});

		it('should raise onError prop with event when media errors', () => {
			const onError = jest.fn();
			const { elem } = setup({
				onError,
			});
			fireEvent.error(elem);
			expect(onError).toHaveBeenCalledTimes(1);
		});

		it('should notify every other second when play time changes', () => {
			const onTimeChange = jest.fn<
				ReturnType<Required<VideoProps>['onTimeChange']>,
				Parameters<Required<VideoProps>['onTimeChange']>
			>();
			const { elem } = setup({
				onTimeChange,
			});

			act(() => {
				fireEvent.canPlay(elem, {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 25,
					},
				});
			});

			fireEvent.timeUpdate(elem, {
				target: { currentTime: 10.5 },
			});
			fireEvent.timeUpdate(elem, {
				target: { currentTime: 10.6 },
			});
			fireEvent.timeUpdate(elem, {
				target: { currentTime: 11.2 },
			});
			fireEvent.timeUpdate(elem, {
				target: { currentTime: 11.5 },
			});

			expect(onTimeChange).toHaveBeenCalledTimes(2);
			expect(onTimeChange).toHaveBeenCalledWith(10, 25);
			expect(onTimeChange).toHaveBeenCalledWith(11, 25);
		});

		it('should only fire onCanPlay once if browser fires multiple', () => {
			const onCanPlay = jest.fn();
			const { elem } = setup({
				onCanPlay,
			});

			act(() => {
				fireEvent.canPlay(elem, {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 25,
					},
				});
				fireEvent.canPlay(elem, {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 25,
					},
				});
			});
			expect(onCanPlay).toHaveBeenCalledTimes(1);
		});

		it('should reset internal hasCanPlayTriggered check on src change', () => {
			const onCanPlay = jest.fn();
			const { elem, rerender } = setup({
				onCanPlay,
			});

			act(() => {
				fireEvent.canPlay(elem, {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 25,
					},
				});
			});

			expect(onCanPlay).toHaveBeenCalledTimes(1);

			rerender(
				<Video src="new-video-url" onCanPlay={onCanPlay}>
					{(videoEl) => videoEl}
				</Video>,
			);

			act(() => {
				fireEvent.canPlay(elem, {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 25,
					},
				});
			});

			expect(onCanPlay).toHaveBeenCalledTimes(2);
		});
	});
});
