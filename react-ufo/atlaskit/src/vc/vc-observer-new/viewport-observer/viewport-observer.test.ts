import { isContainedWithinMediaWrapper } from '../../vc-observer/media-wrapper/vc-utils';

import {
	createIntersectionObserver,
	IntersectionObserverArgs,
	VCIntersectionObserver,
} from './intersection-observer';
import createMutationObserver, { type CreateMutationObserverProps } from './mutation-observer';
import createPerformanceObserver, {
	type CreatePerformanceObserverArgs,
} from './performance-observer';

import ViewportObserver from './index';

jest.mock('../../vc-observer/media-wrapper/vc-utils', () => ({
	isContainedWithinMediaWrapper: jest.fn(),
}));

jest.mock('./intersection-observer');
jest.mock('./mutation-observer');
jest.mock('./performance-observer');

describe('ViewportObserver', () => {
	let mockIntersectionObserver: jest.Mocked<VCIntersectionObserver>;
	let mockMutationObserver: jest.Mocked<MutationObserver>;
	let mockPerformanceObserver: jest.Mocked<PerformanceObserver>;
	let onChangeMock: jest.Mock;

	let onChildListMutation: CreateMutationObserverProps['onChildListMutation'];
	let onAttributeMutation: CreateMutationObserverProps['onAttributeMutation'];

	let intersectionOnEntry: IntersectionObserverArgs['onEntry'];

	let onLayoutShift: CreatePerformanceObserverArgs['onLayoutShift'];

	let observer: ViewportObserver;

	beforeEach(() => {
		mockIntersectionObserver = {
			watchAndTag: jest.fn(),
			disconnect: jest.fn(),
			unobserve: jest.fn(),
		};
		mockMutationObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
			takeRecords: jest.fn(),
		};
		mockPerformanceObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
			takeRecords: jest.fn(),
		};
		onChangeMock = jest.fn();

		(createIntersectionObserver as jest.Mock).mockImplementation(
			(arg: IntersectionObserverArgs) => {
				intersectionOnEntry = arg.onEntry;
				return mockIntersectionObserver;
			},
		);
		(createMutationObserver as jest.Mock).mockImplementation((arg: CreateMutationObserverProps) => {
			onChildListMutation = arg.onChildListMutation;
			onAttributeMutation = arg.onAttributeMutation;
			return mockMutationObserver;
		});
		(createPerformanceObserver as jest.Mock).mockImplementation(
			(arg: CreatePerformanceObserverArgs) => {
				onLayoutShift = arg.onLayoutShift;
				return mockPerformanceObserver;
			},
		);

		observer = new ViewportObserver({ onChange: onChangeMock });
	});

	it('should initialize observers in the constructor', () => {
		expect(createIntersectionObserver).toHaveBeenCalled();
		expect(createMutationObserver).toHaveBeenCalled();
		expect(createPerformanceObserver).toHaveBeenCalled();

		expect(observer).toBeDefined();
	});

	it('should start the observers', () => {
		observer.start();

		expect(mockMutationObserver.observe).toHaveBeenCalledWith(document.body, {
			attributeOldValue: true,
			attributes: true,
			childList: true,
			subtree: true,
		});
		expect(mockPerformanceObserver.observe).toHaveBeenCalledWith({
			type: 'layout-shift',
			buffered: true,
			// @ts-ignore-error
			durationThreshold: 30,
		});
	});

	it('should stop the observers', () => {
		observer.stop();

		expect(mockMutationObserver.disconnect).toHaveBeenCalled();
		expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
		expect(mockPerformanceObserver.disconnect).toHaveBeenCalled();
	});

	describe('Mutation Observer', () => {
		beforeEach(() => {
			(isContainedWithinMediaWrapper as jest.Mock).mockReset();
		});
		describe('onChildListMutation', () => {
			it('should handle added node', () => {
				const node1 = document.createElement('div');
				onChildListMutation({ addedNodes: [node1], removedNodes: [] });

				expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
					node1,
					expect.any(Function),
				);

				const tagFn = mockIntersectionObserver.watchAndTag.mock.calls[0][1];

				if (typeof tagFn !== 'function') {
					// should not come here assertion above already guarantee
					// this block to make Typescript do type assertion
					throw new Error('unexpected error');
				}
				const taggedMutationType = tagFn({ target: node1, rect: new DOMRect(0, 0, 10, 10) });
				expect(taggedMutationType).toEqual('mutation:element');
			});

			it('should handle element remount', () => {
				const oldNode = document.createElement('div');
				oldNode.id = 'id1';

				const oldRect = new DOMRect(0, 0, 10, 10);
				intersectionOnEntry({
					target: oldNode,
					rect: oldRect,
					time: 100,
					type: 'mutation:element',
					mutationData: null,
				});

				const newNode = document.createElement('div');
				newNode.id = 'id1'; // same id as old

				onChildListMutation({ addedNodes: [newNode], removedNodes: [oldNode] });

				expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
					newNode,
					'mutation:remount',
				);
			});

			it('should handle element replacement', () => {
				const oldNode = document.createElement('div');
				oldNode.id = 'old';

				const oldRect = new DOMRect(0, 0, 10, 10);
				intersectionOnEntry({
					target: oldNode,
					rect: oldRect,
					time: 100,
					type: 'mutation:element',
					mutationData: null,
				});

				const newNode = document.createElement('div');
				newNode.id = 'new';
				const newRect = new DOMRect(0, 0, 10, 10);

				onChildListMutation({ addedNodes: [newNode], removedNodes: [oldNode] });

				expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
					newNode,
					expect.any(Function),
				);

				const tagFn = mockIntersectionObserver.watchAndTag.mock.calls[0][1];

				if (typeof tagFn !== 'function') {
					// should not come here assertion above already guarantee
					// this block to make Typescript do type assertion
					throw new Error('unexpected error');
				}
				const taggedMutationType = tagFn({ target: newNode, rect: newRect });
				expect(taggedMutationType).toEqual('mutation:element-replacement');
			});

			it('should handle media wrapper elements', () => {
				const mediaNode = document.createElement('div');
				(isContainedWithinMediaWrapper as jest.Mock).mockReturnValue(true);
				onChildListMutation({ addedNodes: [mediaNode], removedNodes: [] });
				expect(isContainedWithinMediaWrapper).toHaveBeenCalledWith(mediaNode);
				expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
					mediaNode,
					'mutation:media',
				);
			});
		});
		describe('onAttributeMutation', () => {
			it('should handle attribute mutation', () => {
				const target = document.createElement('div');

				onAttributeMutation({ target, attributeName: 'style' });

				expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
					target,
					expect.any(Function),
				);

				const tagFn = mockIntersectionObserver.watchAndTag.mock.calls[0][1];

				if (typeof tagFn !== 'function') {
					// should not come here assertion above already guarantee
					// this block to make Typescript do type assertion
					throw new Error('unexpected error');
				}
				const taggedMutationType = tagFn({ target, rect: new DOMRect(0, 0, 10, 10) });
				expect(typeof taggedMutationType).toEqual('object');
				if (typeof taggedMutationType !== 'object') {
					// should not come here assertion above already guarantee
					// this block to make Typescript do type assertion
					throw new Error('unexpected error');
				}
				expect(taggedMutationType?.type).toEqual('mutation:attribute');
				expect(taggedMutationType?.mutationData.attributeName).toEqual('style');
			});

			it('should handle attribute with no layout shift', () => {
				const target = document.createElement('div');

				const rect = new DOMRect(0, 0, 10, 10);
				intersectionOnEntry({
					target,
					rect,
					time: 100,
					type: 'mutation:element',
					mutationData: null,
				});

				onAttributeMutation({ target, attributeName: 'style' });

				expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
					target,
					expect.any(Function),
				);

				const tagFn = mockIntersectionObserver.watchAndTag.mock.calls[0][1];

				if (typeof tagFn !== 'function') {
					// should not come here assertion above already guarantee
					// this block to make Typescript do type assertion
					throw new Error('unexpected error');
				}
				const taggedMutationType = tagFn({ target, rect });
				expect(typeof taggedMutationType).toEqual('object');
				if (typeof taggedMutationType !== 'object') {
					// should not come here assertion above already guarantee
					// this block to make Typescript do type assertion
					throw new Error('unexpected error');
				}
				expect(taggedMutationType?.type).toEqual('mutation:attribute:no-layout-shift');
				expect(taggedMutationType?.mutationData.attributeName).toEqual('style');
			});
		});

		it('should handle media wrapper attribute mutations', () => {
			const target = document.createElement('div');
			(isContainedWithinMediaWrapper as jest.Mock).mockReturnValue(true);
			onAttributeMutation({ target, attributeName: 'class' });

			expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
				target,
				expect.any(Function),
			);
			const tagFn = mockIntersectionObserver.watchAndTag.mock.calls[0][1];
			if (typeof tagFn !== 'function') {
				throw new Error('unexpected error');
			}
			const taggedMutationType = tagFn({ target, rect: new DOMRect(0, 0, 10, 10) });

			expect(isContainedWithinMediaWrapper).toHaveBeenCalledWith(target);
			expect(typeof taggedMutationType).toEqual('object');
			if (typeof taggedMutationType !== 'object') {
				throw new Error('unexpected error');
			}
			expect(taggedMutationType?.type).toEqual('mutation:media');
			expect(taggedMutationType?.mutationData.attributeName).toEqual('class');
		});
		it('should handle media wrapper attribute mutations with previous rect', () => {
			const target = document.createElement('div');
			(isContainedWithinMediaWrapper as jest.Mock).mockReturnValue(true);
			// First, set an initial rect
			const initialRect = new DOMRect(0, 0, 10, 10);
			intersectionOnEntry({
				target,
				rect: initialRect,
				time: 100,
				type: 'mutation:media',
				mutationData: null,
			});
			onAttributeMutation({ target, attributeName: 'class' });
			
			expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
				target,
				expect.any(Function),
			);
			const tagFn = mockIntersectionObserver.watchAndTag.mock.calls[0][1];
			if (typeof tagFn !== 'function') {
				throw new Error('unexpected error');
			}
			// Test with a new rect
			const newRect = new DOMRect(0, 0, 20, 20);
			const taggedMutationType = tagFn({ target, rect: newRect });
			
			expect(isContainedWithinMediaWrapper).toHaveBeenCalledWith(target);
			expect(typeof taggedMutationType).toEqual('object');
			if (typeof taggedMutationType !== 'object') {
				throw new Error('unexpected error');
			}
			expect(taggedMutationType?.type).toEqual('mutation:media');
			expect(taggedMutationType?.mutationData.attributeName).toEqual('class');
		});
	});

	describe('Intersection Observer', () => {
		it('should invoke onChange', () => {
			const target = document.createElement('div');
			const rect = new DOMRect(0, 0, 100, 100);
			intersectionOnEntry({
				time: 100,
				type: 'mutation:attribute',
				target,
				rect,
				mutationData: {
					attributeName: 'style',
				},
			});

			expect(onChangeMock).toHaveBeenCalledWith({
				time: 100,
				type: 'mutation:attribute',
				elementRef: new WeakRef(target),
				visible: true,
				rect,
				previousRect: undefined,
				mutationData: {
					attributeName: 'style',
				},
			});
		});

		it('should invoke onChange with correct previousRect', () => {
			const target = document.createElement('div');
			const rectOld = new DOMRect(0, 0, 100, 100);
			intersectionOnEntry({
				time: 100,
				type: 'mutation:attribute',
				target,
				rect: rectOld,
				mutationData: {
					attributeName: 'style',
				},
			});

			const rectNew = new DOMRect(0, 0, 200, 200);
			intersectionOnEntry({
				time: 100,
				type: 'mutation:attribute',
				target,
				rect: rectNew,
				mutationData: {
					attributeName: 'style',
				},
			});

			expect(onChangeMock).toHaveBeenNthCalledWith(2, {
				time: 100,
				type: 'mutation:attribute',
				elementRef: new WeakRef(target),
				visible: true,
				rect: rectNew,
				previousRect: rectOld,
				mutationData: {
					attributeName: 'style',
				},
			});
		});
	});

	describe('Performance Observer', () => {
		it('should invoke onChange', () => {
			const node = document.createElement('div');
			const rectOld = new DOMRect(0, 0, 100, 100);
			const rectNew = new DOMRect(0, 0, 200, 200);
			onLayoutShift({
				time: 100,
				changedRects: [
					{
						node,
						rect: rectNew,
						previousRect: rectOld,
					},
				],
			});
			expect(onChangeMock).toHaveBeenCalledWith({
				time: 100,
				type: 'layout-shift',
				elementRef: new WeakRef(node),
				visible: true,
				rect: rectNew,
				previousRect: rectOld,
			});
		});
	});
});
