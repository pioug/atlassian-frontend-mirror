import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntryType } from '../../types';

import { createIntersectionObserver } from './index';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));
const mockFg = fg as jest.Mock;

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

		jest.spyOn(window, 'IntersectionObserver').mockImplementation(() => {
			return mockObserver;
		});

		observer = createIntersectionObserver({
			onEntry: onEntryMock,
			onObserved: onObservedMock,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockFg.mockReset();
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

	describe('framework routing mutations with display:none style changes', () => {
		const zeroRect: DOMRectReadOnly = {
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			toJSON: () => ({}),
		};

		describe('when platform_ufo_vc_ignore_display_none_mutations feature flag is enabled', () => {
			beforeEach(() => {
				mockFg.mockImplementation(
					(flag) => flag === 'platform_ufo_vc_ignore_display_none_mutations',
				);
			});

			it('should classify mutation:attribute as mutation:attribute:framework-routing when style changes from empty string to display:none', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: '',
						newValue: 'display: none !important;',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				// Simulate zero dimension rectangle which triggers display-contents children handling
				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				// Since element has zero dimensions, it should observe children with the zeroDimensionRectangleTagCallback
				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify mutation:attribute as mutation:attribute:framework-routing when style changes from null to display:none', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: null,
						newValue: 'display: none !important;',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify mutation:attribute as mutation:attribute:framework-routing when style changes from undefined to display:none', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: undefined,
						newValue: 'display: none !important;',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify mutation:attribute as mutation:attribute:framework-routing when style changes from display:none to empty string', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: 'display: none !important;',
						newValue: '',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				// Simulate zero dimension rectangle
				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify mutation:attribute as mutation:attribute:framework-routing when style changes from display:none to null', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: 'display: none !important;',
						newValue: null,
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify mutation:attribute as mutation:attribute:framework-routing when style changes from display:none to undefined', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: 'display: none !important;',
						newValue: undefined,
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify as mutation:display-contents-children-attribute for non-routing style mutations', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: 'color: red;',
						newValue: 'color: blue;',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});

			it('should classify as mutation:display-contents-children-attribute for non-style attribute mutations', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'class',
						oldValue: 'old-class',
						newValue: 'new-class',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});
		});

		describe('when platform_ufo_vc_ignore_display_none_mutations feature flag is disabled', () => {
			beforeEach(() => {
				mockFg.mockImplementation(() => false);
			});

			it('should classify as mutation:display-contents-children-attribute even for routing style mutations', () => {
				const element = document.createElement('div');
				const childElement = document.createElement('div');
				element.appendChild(childElement);

				observer?.watchAndTag(element, () => ({
					type: 'mutation:attribute',
					mutationData: {
						attributeName: 'style',
						oldValue: '',
						newValue: 'display: none !important;',
					},
				}));

				const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];

				callback([
					{ target: element, isIntersecting: false, intersectionRect: zeroRect, time: 123 },
				]);

				expect(mockObserver.observe).toHaveBeenCalledWith(childElement);
			});
		});
	});
});
