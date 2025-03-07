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

describe('VCObserverNew', () => {
	let vcObserver: VCObserverNew;
	let mockViewportObserver: jest.Mocked<ViewportObserver>;
	let mockWindowEventObserver: jest.Mocked<WindowEventObserver>;
	let mockEntriesTimeline: jest.Mocked<EntriesTimeline>;

	beforeEach(() => {
		// Clear all mocks
		jest.clearAllMocks();

		// Create instance with default config
		const config: VCObserverNewConfig = {};
		vcObserver = new VCObserverNew(config);

		// Get mock instances
		mockViewportObserver = ViewportObserver as unknown as jest.Mocked<ViewportObserver>;
		mockWindowEventObserver = WindowEventObserver as unknown as jest.Mocked<WindowEventObserver>;
		mockEntriesTimeline = EntriesTimeline.prototype as jest.Mocked<EntriesTimeline>;
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
				type: 'mutation:element',
				data: {
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
				type: 'window:event',
				data: {
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
					type: 'mutation:element',
					data: {
						elementName: 'element1',
						rect: new DOMRect(0, 0, 10, 10),
						visible: true,
					},
				},
			];
			const mockResult = { revision: 'fy25.03', clean: true, 'metric:vc90': 100 };

			mockEntriesTimeline.getOrderedEntries.mockReturnValue(mockEntries);
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue(mockResult);

			const result = await vcObserver.getVCResult({ start: 0, stop: 1000 });

			expect(mockEntriesTimeline.getOrderedEntries).toHaveBeenCalledWith({
				start: 0,
				stop: 1000,
			});
			expect(VCCalculator_FY25_03.prototype.calculate).toHaveBeenCalledWith({
				orderedEntries: mockEntries,
				startTime: 0,
				stopTime: 1000,
			});
			expect(result).toEqual([mockResult]);
		});

		it('should handle empty calculator results', async () => {
			mockEntriesTimeline.getOrderedEntries.mockReturnValue([]);
			(VCCalculator_FY25_03.prototype.calculate as jest.Mock).mockResolvedValue(undefined);

			const result = await vcObserver.getVCResult({ start: 0, stop: 1000 });

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
});
