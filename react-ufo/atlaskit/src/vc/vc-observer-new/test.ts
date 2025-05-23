import { fg } from '@atlaskit/platform-feature-flags';

import EntriesTimeline from './entries-timeline';
import * as getElementNameModule from './get-element-name';
import VCCalculator_FY25_03 from './metric-calculator/fy25_03';
import { VCObserverEntry } from './types';
import ViewportObserver from './viewport-observer';
import WindowEventObserver from './window-event-observer';

import VCObserverNew, { VCObserverNewConfig } from './index';

// Mock dependencies
jest.mock('./viewport-observer');
jest.mock('./window-event-observer');
jest.mock('./entries-timeline');
jest.mock('./metric-calculator/fy25_03');
jest.mock('./get-element-name');
jest.mock('@atlaskit/platform-feature-flags');

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

		// Default feature flag to be enabled
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_vc_observer_new_ssr_abort_listener') {
				return true;
			}
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
			// Ensure feature flag is enabled
			(fg as jest.Mock).mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_vc_observer_new_ssr_abort_listener') {
					return true;
				}
				return false;
			});

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
			// Ensure feature flag is enabled
			(fg as jest.Mock).mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_vc_observer_new_ssr_abort_listener') {
					return true;
				}
				return false;
			});

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

	describe('start/stop methods with feature gate', () => {
		it('should process abort events when feature flag is enabled', () => {
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

			// Ensure feature flag is enabled
			(fg as jest.Mock).mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_vc_observer_new_ssr_abort_listener') {
					return true;
				}
				return false;
			});

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

		it('should NOT process abort events when feature flag is disabled', () => {
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

			// Disable the feature flag
			(fg as jest.Mock).mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_vc_observer_new_ssr_abort_listener') {
					return false;
				}
				return false;
			});

			// Call start
			vcObserver.start({ startTime: 100 });

			// Verify the unbind was NOT called
			expect(mockUnbind).not.toHaveBeenCalled();

			// Verify NO abort events were added to the timeline
			expect(mockEntriesTimeline.push).not.toHaveBeenCalled();

			// Verify window.__SSR_ABORT_LISTENERS__ was NOT deleted and still exists
			expect(window.__SSR_ABORT_LISTENERS__).toBeDefined();
		});
	});
});
