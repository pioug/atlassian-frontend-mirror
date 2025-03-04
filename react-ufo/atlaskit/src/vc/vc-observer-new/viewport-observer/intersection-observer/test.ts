import { VCObserverEntryType } from '../../types';

import { createIntersectionObserver } from './index';

describe('createIntersectionObserver', () => {
	let mockObserver: IntersectionObserver;

	let observer: ReturnType<typeof createIntersectionObserver> | null;
	let onEntryMock: jest.Mock;
	let onObservedMock: jest.Mock;

	beforeEach(() => {
		onEntryMock = jest.fn();
		onObservedMock = jest.fn();

		mockObserver = {
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as IntersectionObserver;

		jest.spyOn(window, 'IntersectionObserver').mockImplementation((callback) => {
			return mockObserver;
		});

		observer = createIntersectionObserver({
			onEntry: onEntryMock,
			onObserved: onObservedMock,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return a VCIntersectionObserver object if supported', () => {
		expect(observer).not.toBeNull();
	});

	it('should call observe on watchAndTag', () => {
		const element = document.createElement('div');
		const tag: VCObserverEntryType = 'mutation:element';

		observer?.watchAndTag(element, tag);

		expect(mockObserver.observe).toHaveBeenCalledWith(element);
	});

	it('should disconnect the observer on disconnect', () => {
		observer?.disconnect();

		expect(mockObserver.disconnect).toHaveBeenCalled();
	});

	it('should unobserve element on unobserve', () => {
		const element = document.createElement('div');

		observer?.unobserve(element);

		expect(mockObserver.unobserve).toHaveBeenCalledWith(element);
	});

	it('should handle intersection entries and call onEntry', () => {
		const element = document.createElement('div');
		const rect: DOMRectReadOnly = {
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			toJSON: () => ({}),
		};

		observer?.watchAndTag(element, 'mutation:element');

		const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

		callback([{ target: element, isIntersecting: true, intersectionRect: rect, time: 123 }]);

		expect(onEntryMock).toHaveBeenCalledWith({
			target: element,
			rect,
			time: 123,
			type: 'mutation:element',
			mutationData: null,
		});

		expect(onObservedMock).toHaveBeenCalled();
	});

	it('should handle intersection entries with doTag Function and call onEntry', () => {
		const element = document.createElement('div');
		const rect: DOMRectReadOnly = {
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			toJSON: () => ({}),
		};

		observer?.watchAndTag(element, () => 'mutation:element');

		// const mockObserverInstance = (window.IntersectionObserver as jest.Mock).mock.instances[0] as MockIntersectionObserver;
		const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

		callback([{ target: element, isIntersecting: true, intersectionRect: rect, time: 123 }]);

		expect(onEntryMock).toHaveBeenCalledWith({
			target: element,
			rect,
			time: 123,
			type: 'mutation:element',
			mutationData: null,
		});

		expect(onObservedMock).toHaveBeenCalled();
	});

	it('should handle intersection entries with doTag Function returning null and call onEntry', () => {
		const element = document.createElement('div');
		const rect: DOMRectReadOnly = {
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			toJSON: () => ({}),
		};

		observer?.watchAndTag(element, () => null);

		// const mockObserverInstance = (window.IntersectionObserver as jest.Mock).mock.instances[0] as MockIntersectionObserver;
		const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

		callback([{ target: element, isIntersecting: true, intersectionRect: rect, time: 123 }]);

		expect(onEntryMock).toHaveBeenCalledWith({
			target: element,
			rect,
			time: 123,
			type: 'unknown',
			mutationData: null,
		});

		expect(onObservedMock).toHaveBeenCalled();
	});

	it('should handle intersection entries with doTag Function returning mutation Data and call onEntry', () => {
		const element = document.createElement('div');
		const rect: DOMRectReadOnly = {
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			toJSON: () => ({}),
		};

		observer?.watchAndTag(element, () => ({
			type: 'mutation:attribute',
			mutationData: {
				attributeName: 'div1',
			},
		}));

		// const mockObserverInstance = (window.IntersectionObserver as jest.Mock).mock.instances[0] as MockIntersectionObserver;
		const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

		callback([{ target: element, isIntersecting: true, intersectionRect: rect, time: 123 }]);

		expect(onEntryMock).toHaveBeenCalledWith({
			target: element,
			rect,
			time: 123,
			type: 'mutation:attribute',
			mutationData: {
				attributeName: 'div1',
			},
		});

		expect(onObservedMock).toHaveBeenCalled();
	});
});
