import { fg } from '@atlaskit/platform-feature-flags';

import EntriesTimeline from './entries-timeline';
import * as getElementNameModule from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import type { VCObserverEntry } from './types';
import ViewportObserver from './viewport-observer';
import WindowEventObserver from './window-event-observer';

import VCObserverNew, { type VCObserverNewConfig } from './index';

// Mock dependencies
jest.mock('./viewport-observer');
jest.mock('./window-event-observer');
jest.mock('./entries-timeline');
jest.mock('./metric-calculator/fy25_03');
jest.mock('./get-element-name');
jest.mock('@atlaskit/platform-feature-flags');
jest.mock('../vc-observer/observers/ssr-placeholders');

describe('VCObserverNew', () => {
	let vcObserver: VCObserverNew;
	let mockViewportObserver: jest.Mocked<ViewportObserver>;
	let mockWindowEventObserver: jest.Mocked<WindowEventObserver>;
	let mockEntriesTimeline: jest.Mocked<EntriesTimeline>;
	// Save original window property
	let originalSsrAbortListeners: any;

	beforeEach(() => {
		// Clear all mocks
		jest.clearAllMocks();

		// Default feature flag mock
		(fg as jest.Mock).mockImplementation((flag: string) => {
			return false;
		});

		// Save and clear window.__SSR_ABORT_LISTENERS__ if it exists
		originalSsrAbortListeners = window.__SSR_ABORT_LISTENERS__;
		delete window.__SSR_ABORT_LISTENERS__;

		// Create instance with default config
		const config: VCObserverNewConfig = {};
		vcObserver = new VCObserverNew(config);

		// Get mock instances
		mockViewportObserver = ViewportObserver as unknown as jest.Mocked<ViewportObserver>;
		mockWindowEventObserver = WindowEventObserver as unknown as jest.Mocked<WindowEventObserver>;
		mockEntriesTimeline = EntriesTimeline.prototype as jest.Mocked<EntriesTimeline>;
	});

	afterEach(() => {
		// Restore window.__SSR_ABORT_LISTENERS__
		if (originalSsrAbortListeners !== undefined) {
			window.__SSR_ABORT_LISTENERS__ = originalSsrAbortListeners;
		} else {
			delete window.__SSR_ABORT_LISTENERS__;
		}
	});

	describe('constructor', () => {
		it('should initialize with default selector config when not provided', () => {
			const observer = new VCObserverNew({});
			expect(observer['selectorConfig']).toEqual({
				id: false,
				testId: true,
				role: false,
				className: false,
				dataVC: true,
			});
		});

		it('should use custom selector config when provided', () => {
			const customConfig: VCObserverNewConfig = {
				selectorConfig: {
					id: true,
					testId: false,
					role: true,
					className: true,
					dataVC: false,
				},
			};
			const observer = new VCObserverNew(customConfig);
			expect(observer['selectorConfig']).toEqual(customConfig.selectorConfig);
		});
	});

	describe('start/stop methods', () => {
		it('should start viewport and window event observers', () => {
			vcObserver.start({ startTime: 100 });
			// @ts-expect-error
			expect(mockViewportObserver.prototype.start).toHaveBeenCalled();
			// @ts-expect-error
			expect(mockWindowEventObserver.prototype.start).toHaveBeenCalled();
		});

		it('should stop viewport and window event observers', () => {
			vcObserver.stop();
			// @ts-expect-error
			expect(mockViewportObserver.prototype.stop).toHaveBeenCalled();
			// @ts-expect-error
			expect(mockWindowEventObserver.prototype.stop).toHaveBeenCalled();
		});

		it('should process abort events when window.__SSR_ABORT_LISTENERS__ exists but not unbind or delete it', () => {
			// Mock the window.__SSR_ABORT_LISTENERS__ object
			const mockUnbind = jest.fn();
			const aborts = {
				wheel: 50,
				keydown: 75,
			};

			window.__SSR_ABORT_LISTENERS__ = {
				unbinds: [mockUnbind],
				aborts,
			};

			// Call start
			vcObserver.start({ startTime: 100 });

			// Verify the unbind was NOT called (this is now the responsibility of VCObserverWrapper)
			expect(mockUnbind).not.toHaveBeenCalled();

			// Verify abort events were added to the timeline
			expect(mockEntriesTimeline.push).toHaveBeenCalledTimes(2);
			expect(mockEntriesTimeline.push).toHaveBeenNthCalledWith(1, {
				time: 50,
				data: {
					type: 'window:event',
					eventType: 'wheel',
				},
			});
			expect(mockEntriesTimeline.push).toHaveBeenNthCalledWith(2, {
				time: 75,
				data: {
					type: 'window:event',
					eventType: 'keydown',
				},
			});

			// Verify window.__SSR_ABORT_LISTENERS__ was NOT deleted
			expect(window.__SSR_ABORT_LISTENERS__).toBeDefined();
		});

		it('should handle empty aborts object in window.__SSR_ABORT_LISTENERS__ without unbinding or deleting it', () => {
			// Mock the window.__SSR_ABORT_LISTENERS__ object with empty aborts
			const mockUnbind = jest.fn();
			window.__SSR_ABORT_LISTENERS__ = {
				unbinds: [mockUnbind],
				aborts: {},
			};

			// Call start
			vcObserver.start({ startTime: 100 });

			// Verify the unbind was NOT called
			expect(mockUnbind).not.toHaveBeenCalled();

			// Verify no entries were pushed to the timeline
			expect(mockEntriesTimeline.push).not.toHaveBeenCalled();

			// Verify window.__SSR_ABORT_LISTENERS__ was NOT deleted
			expect(window.__SSR_ABORT_LISTENERS__).toBeDefined();
		});

		it('should work correctly when window.__SSR_ABORT_LISTENERS__ does not exist', () => {
			// Ensure window.__SSR_ABORT_LISTENERS__ is undefined
			delete window.__SSR_ABORT_LISTENERS__;

			// Call start
			vcObserver.start({ startTime: 100 });

			// Verify the timeline's push method was not called
			expect(mockEntriesTimeline.push).not.toHaveBeenCalled();

			// The windowEventObserver.start() method should still be called
			// @ts-expect-error
			expect(mockWindowEventObserver.prototype.start).toHaveBeenCalled();
		});
	});

	describe('viewport observer callbacks', () => {
		it('should handle viewport changes and add entries to timeline', () => {
			// Get the onChange callback that was passed to ViewportObserver
			const onChangeCallback = (ViewportObserver as jest.Mock).mock.calls[0][0].onChange;

			const mockElement = document.createElement('div');
			const mockWeakRef = new WeakRef(mockElement);

			jest.spyOn(getElementNameModule, 'default').mockReturnValue('test-element');

			onChangeCallback({
				time: 100,
				type: 'mutation:element',
				elementRef: mockWeakRef,
				visible: true,
				rect: new DOMRect(),
				previousRect: undefined,
				mutationData: { attributeName: 'class' },
			});

			expect(mockEntriesTimeline.push).toHaveBeenCalledWith({
				time: 100,
				data: {
					type: 'mutation:element',
					elementName: 'test-element',
					rect: expect.any(DOMRect),
					previousRect: undefined,
					visible: true,
					attributeName: 'class',
				},
			});
		});
	});

	describe('window event observer callbacks', () => {
		it('should handle window events and add entries to timeline', () => {
			// Get the onEvent callback that was passed to WindowEventObserver
			const onEventCallback = (WindowEventObserver as jest.Mock).mock.calls[0][0].onEvent;

			onEventCallback({
				time: 200,
				type: 'scroll',
			});

			expect(mockEntriesTimeline.push).toHaveBeenCalledWith({
				time: 200,
				data: {
					type: 'window:event',
					eventType: 'scroll',
				},
			});
		});
	});

	describe('getVCResult', () => {
		it('should calculate and return VC results', async () => {
			const mockEntries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'mutation:element',
						elementName: 'element1',
						rect: new DOMRect(0, 0, 10, 10),
						visible: true,
					},
				},
			];
			const mockResult = { revision: 'fy25.03', clean: true, 'metric:vc90': 100 };

			mockEntriesTimeline.getOrderedEntries.mockReturnValue(mockEntries);
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue(mockResult);

			const result = await vcObserver.getVCResult({
				start: 0,
				stop: 1000,
				interactionId: 'test-interaction-id',
			});

			expect(mockEntriesTimeline.getOrderedEntries).toHaveBeenCalledWith({
				start: 0,
				stop: 1000,
			});
			expect(VCCalculator_FY25_03.prototype.calculate).toHaveBeenCalledWith({
				orderedEntries: mockEntries,
				startTime: 0,
				stopTime: 1000,
				interactionId: 'test-interaction-id',
				isPostInteraction: false,
			});
			expect(result).toEqual([mockResult]);
		});

		it('should handle empty calculator results', async () => {
			mockEntriesTimeline.getOrderedEntries.mockReturnValue([]);
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue(undefined);

			const result = await vcObserver.getVCResult({
				start: 0,
				stop: 1000,
				interactionId: 'test-interaction-id',
			});

			expect(result).toEqual([]);
		});
	});

	describe('getElementName', () => {
		it('should call getElementName with correct parameters', () => {
			const mockElement = document.createElement('div');
			vcObserver['getElementName'](mockElement);

			expect(getElementNameModule.default).toHaveBeenCalledWith(
				vcObserver['selectorConfig'],
				mockElement,
			);
		});
	});

	describe('start/stop methods with SSR abort listeners', () => {
		it('should process abort events from window.__SSR_ABORT_LISTENERS__', () => {
			// Mock the window.__SSR_ABORT_LISTENERS__ object
			const mockUnbind = jest.fn();
			const aborts = {
				wheel: 50,
				keydown: 75,
			};

			window.__SSR_ABORT_LISTENERS__ = {
				unbinds: [mockUnbind],
				aborts,
			};

			// Call start
			vcObserver.start({ startTime: 100 });

			// Verify the unbind was NOT called
			expect(mockUnbind).not.toHaveBeenCalled();

			// Verify abort events were added to the timeline
			expect(mockEntriesTimeline.push).toHaveBeenCalledTimes(2);
			expect(mockEntriesTimeline.push).toHaveBeenNthCalledWith(1, {
				time: 50,
				data: {
					type: 'window:event',
					eventType: 'wheel',
				},
			});
			expect(mockEntriesTimeline.push).toHaveBeenNthCalledWith(2, {
				time: 75,
				data: {
					type: 'window:event',
					eventType: 'keydown',
				},
			});

			// Verify window.__SSR_ABORT_LISTENERS__ was NOT deleted
			expect(window.__SSR_ABORT_LISTENERS__).toBeDefined();
		});
	});

	describe('addStartEntry', () => {
		it('should add START entry', async () => {
			const startTime = 123.456;
			const stopTime = 500;

			// Mock calculator to return a result
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue({
				revision: 'fy25.03',
				clean: true,
				'metric:vc90': 100,
			});

			await vcObserver.getVCResult({
				start: startTime,
				stop: stopTime,
				interactionId: 'test-interaction-id',
			});

			// Verify START entry was added to the timeline
			expect(mockEntriesTimeline.push).toHaveBeenCalledWith({
				time: startTime,
				data: {
					type: 'mutation:element',
					elementName: 'START',
					visible: true,
					rect: {
						x: 0,
						y: 0,
						width: window.innerWidth,
						height: window.innerHeight,
						top: 0,
						left: 0,
						bottom: window.innerHeight,
						right: window.innerWidth,
						toJSON: expect.any(Function),
					},
				},
			});
		});

		it('should create START entry with correct DOMRect structure', async () => {
			// Mock window dimensions
			Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
			Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });

			const startTime = 100;
			const stopTime = 500;

			// Mock calculator to return a result
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue({
				revision: 'fy25.03',
				clean: true,
				'metric:vc90': 100,
			});

			await vcObserver.getVCResult({
				start: startTime,
				stop: stopTime,
				interactionId: 'test-interaction-id',
			});

			// Get the call arguments
			const pushCall = mockEntriesTimeline.push.mock.calls.find(
				(call) => 'elementName' in call[0].data && call[0].data.elementName === 'START',
			);

			expect(pushCall).toBeDefined();
			const rectData = (pushCall as any)[0].data.rect;

			// Verify rect structure
			expect(rectData).toEqual({
				x: 0,
				y: 0,
				width: 1920,
				height: 1080,
				top: 0,
				left: 0,
				bottom: 1080,
				right: 1920,
				toJSON: expect.any(Function),
			});

			// Verify toJSON function works correctly
			const jsonResult = rectData.toJSON();
			expect(jsonResult).toEqual({
				x: 0,
				y: 0,
				width: 1920,
				height: 1080,
				top: 0,
				left: 0,
				bottom: 1080,
				right: 1920,
			});
		});

		it('should add START entry before getOrderedEntries is called', async () => {
			const startTime = 100;
			const stopTime = 500;

			// Mock calculator to return a result
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue({
				revision: 'fy25.03',
				clean: true,
				'metric:vc90': 100,
			});

			await vcObserver.getVCResult({
				start: startTime,
				stop: stopTime,
				interactionId: 'test-interaction-id',
			});

			// Verify that push was called before getOrderedEntries
			const pushCallIndex = mockEntriesTimeline.push.mock.invocationCallOrder[0];
			const getOrderedEntriesCallIndex =
				mockEntriesTimeline.getOrderedEntries.mock.invocationCallOrder[0];

			expect(pushCallIndex).toBeLessThan(getOrderedEntriesCallIndex);
		});
	});

	describe('SSR functionality', () => {
		beforeEach(() => {
			// Enable SSR feature flag for these tests
			(fg as jest.Mock).mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_vc_v3_ssr_placeholder') {
					return true;
				}
				return false;
			});
		});

		describe('SSR placeholder initialization', () => {
			it('should initialize SSR placeholder handler when feature flag is enabled', () => {
				const config: VCObserverNewConfig = {
					SSRConfig: {
						enablePageLayoutPlaceholder: true,
						disableSizeAndPositionCheck: { v: true, h: false },
					},
				};

				const observer = new VCObserverNew(config);
				const ssrHandler = observer.getSSRPlaceholderHandler();

				expect(ssrHandler).toBeDefined();
			});
		});

		describe('SSR state management', () => {
			let observer: VCObserverNew;
			let mockElement: HTMLElement;

			beforeEach(() => {
				observer = new VCObserverNew({});
				mockElement = document.createElement('div');
			});

			it('should set react root element', () => {
				observer.setReactRootElement(mockElement);
				const ssrState = observer.getSSRState();

				expect(ssrState.reactRootElement).toBe(mockElement);
			});

			it('should set react root render start and update state', () => {
				const startTime = 100;
				observer.setReactRootRenderStart(startTime);
				const ssrState = observer.getSSRState();

				expect(ssrState.renderStart).toBe(startTime);
				expect(ssrState.state).toBe(2); // waitingForFirstRender
			});

			it('should set react root render stop', () => {
				const stopTime = 200;
				observer.setReactRootRenderStop(stopTime);
				const ssrState = observer.getSSRState();

				expect(ssrState.renderStop).toBe(stopTime);
			});

			it('should use performance.now() as default when no time provided', () => {
				const perfNowSpy = jest.spyOn(performance, 'now').mockReturnValue(123.456);

				observer.setReactRootRenderStart();
				observer.setReactRootRenderStop();

				const ssrState = observer.getSSRState();
				expect(ssrState.renderStart).toBe(123.456);
				expect(ssrState.renderStop).toBe(123.456);

				perfNowSpy.mockRestore();
			});
		});

		describe('SSR state reset on start', () => {
			it('should reset SSR state on start including root element (matches old VCObserver)', () => {
				const observer = new VCObserverNew({});
				const mockElement = document.createElement('div');

				// Set initial SSR state
				observer.setReactRootElement(mockElement);
				observer.setReactRootRenderStart(100);
				observer.setReactRootRenderStop(200);

				// Start the observer
				observer.start({ startTime: 150 });

				const ssrState = observer.getSSRState();
				expect(ssrState.reactRootElement).toBe(null); // Reset to null (matches old VCObserver)
				expect(ssrState.renderStart).toBe(-1); // Reset
				expect(ssrState.renderStop).toBe(-1); // Reset
				expect(ssrState.state).toBe(1); // normal
			});

			it('should NOT call clear on SSR placeholder handler during start (matches old VCObserver)', () => {
				const observer = new VCObserverNew({
					SSRConfig: {
						enablePageLayoutPlaceholder: true,
					},
				});

				const mockSSRHandler = observer.getSSRPlaceholderHandler();
				const clearSpy = jest.spyOn(mockSSRHandler!, 'clear');

				observer.start({ startTime: 100 });

				expect(clearSpy).not.toHaveBeenCalled();
			});
		});

		describe('ViewportObserver SSR integration', () => {
			it('should pass SSR context functions to ViewportObserver', () => {
				const observer = new VCObserverNew({});
				expect(observer).toBeDefined();

				// Check that ViewportObserver was constructed with SSR context
				expect(ViewportObserver).toHaveBeenCalledWith(
					expect.objectContaining({
						getSSRState: expect.any(Function),
						getSSRPlaceholderHandler: expect.any(Function),
					}),
				);
			});
		});

		describe('SSR hydration behavior', () => {
			it('should handle SSR hydration mutations correctly', () => {
				const observer = new VCObserverNew({});
				const mockElement = document.createElement('div');

				// Set up SSR state for hydration
				observer.setReactRootElement(mockElement);
				observer.setReactRootRenderStart(100);

				const ssrState = observer.getSSRState();
				expect(ssrState.state).toBe(2); // waitingForFirstRender
				expect(ssrState.reactRootElement).toBe(mockElement);
				expect(ssrState.renderStart).toBe(100);
			});

			it('should transition SSR state correctly during hydration process', () => {
				const observer = new VCObserverNew({});
				const mockElement = document.createElement('div');

				observer.setReactRootElement(mockElement);
				observer.setReactRootRenderStart(100);

				let ssrState = observer.getSSRState();
				expect(ssrState.state).toBe(2); // waitingForFirstRender

				// Simulate state transition to ignoring (this would happen in ViewportObserver)
				ssrState.state = 3; // ignoring
				ssrState.renderStop = 600; // 500ms window

				expect(ssrState.state).toBe(3); // ignoring
				expect(ssrState.renderStop).toBe(600);
			});
		});

		describe('SSR placeholder validation', () => {
			it('should handle placeholder size matching correctly', () => {
				const observer = new VCObserverNew({
					SSRConfig: {
						enablePageLayoutPlaceholder: true,
					},
				});

				const ssrHandler = observer.getSSRPlaceholderHandler();
				expect(ssrHandler).toBeDefined();
				expect(observer).toBeDefined();

				// The actual size matching logic is tested in the SSRPlaceholderHandlers tests
				// Here we just verify the handler is properly initialized
			});
		});
	});
});
