import { fg } from '@atlaskit/platform-feature-flags';

import checkWithinComponent from './check-within-component';

// Mock the feature flag
jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

// Mock Fiber node structure
type MockFiber = {
	key: string | null;
	type: {
		displayName?: string;
		name?: string;
	} | null;
	memoizedProps?: any;
	pendingProps?: any;
	return: MockFiber | null;
};

describe('checkWithinComponent', () => {
	// Use a consistent fiber key for testing
	const fiberKey = '__reactFiber$test';
	const mapIs3pResult = new WeakMap<HTMLElement, boolean>();

	const createMockNode = (fiber: MockFiber | null): HTMLElement => {
		const node = document.createElement('div') as unknown as HTMLElement & {
			[key: string]: MockFiber | null;
		};
		node[fiberKey] = fiber;
		return node;
	};

	describe('basic component checking', () => {
		it('should return false when node has no fiber', () => {
			const node = createMockNode(null);
			const result = checkWithinComponent(node, 'TargetComponent', mapIs3pResult);
			expect(result.isWithin).toBe(false);
		});

		it('should return false when target component is not found', () => {
			const fiber: MockFiber = {
				key: null,
				type: { name: 'OtherComponent' },
				return: null,
			};
			const node = createMockNode(fiber);
			const result = checkWithinComponent(node, 'TargetComponent', mapIs3pResult);
			expect(result.isWithin).toBe(false);
		});

		it('should return true when target component is found', () => {
			const fiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			const node = createMockNode(fiber);
			const result = checkWithinComponent(node, 'TargetComponent', mapIs3pResult);
			expect(result.isWithin).toBe(true);
		});

		it('should find target component in parent hierarchy', () => {
			const parentFiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			const childFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				return: parentFiber,
			};
			const node = createMockNode(childFiber);
			const result = checkWithinComponent(node, 'TargetComponent', mapIs3pResult);
			expect(result.isWithin).toBe(true);
		});

		it('should use displayName when available', () => {
			const fiber: MockFiber = {
				key: null,
				type: { displayName: 'TargetComponent', name: 'DifferentName' },
				return: null,
			};
			const node = createMockNode(fiber);
			const result = checkWithinComponent(node, 'TargetComponent', mapIs3pResult);
			expect(result.isWithin).toBe(true);
		});
	});
});

describe('Using checkWithinComponent to check UFOThirdPartySegment', () => {
	// Use a consistent fiber key for testing
	const fiberKey = '__reactFiber$test';
	const mapIs3pResult = new WeakMap<HTMLElement, boolean>();

	const createMockNode = (fiber: MockFiber | null): HTMLElement => {
		const node = document.createElement('div') as unknown as HTMLElement & {
			[key: string]: MockFiber | null;
		};
		node[fiberKey] = fiber;
		return node;
	};

	it('should return false when not within UFOThirdPartySegment', () => {
		const fiber: MockFiber = {
			key: null,
			type: { name: 'OtherComponent' },
			return: null,
		};
		const node = createMockNode(fiber);
		const result = checkWithinComponent(node, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(false);
	});

	it('should return true when within UFOThirdPartySegment without UFOIgnoreHolds', async () => {
		const fiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		const node = createMockNode(fiber);
		const result = checkWithinComponent(node, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(true);
	});

	it('should extract ignoredReason from UFOIgnoreHolds when found in the fiber tree', () => {
		const ignoreHoldsFiber: MockFiber = {
			key: null,
			type: { name: 'UFOIgnoreHolds' },
			memoizedProps: { reason: 'third-party-element' },
			return: null,
		};
		const thirdPartySegmentFiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		ignoreHoldsFiber.return = thirdPartySegmentFiber;
		const node = createMockNode(ignoreHoldsFiber);

		const result = checkWithinComponent(node, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(true);
	});

	it('should get the nearest UFOIgnoreHolds (closest to UFOThirdPartySegment)', async () => {
		const farIgnoreHoldsFiber: MockFiber = {
			key: null,
			type: { name: 'UFOIgnoreHolds' },
			memoizedProps: { reason: 'far-reason' },
			return: null,
		};
		const nearIgnoreHoldsFiber: MockFiber = {
			key: null,
			type: { name: 'UFOIgnoreHolds' },
			memoizedProps: { reason: 'near-reason' },
			return: null,
		};
		const thirdPartySegmentFiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		farIgnoreHoldsFiber.return = nearIgnoreHoldsFiber;
		nearIgnoreHoldsFiber.return = thirdPartySegmentFiber;
		const node = createMockNode(farIgnoreHoldsFiber);

		const result = checkWithinComponent(node, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(true);
	});

	it('should use pendingProps when memoizedProps is not available', async () => {
		const ignoreHoldsFiber: MockFiber = {
			key: null,
			type: { name: 'UFOIgnoreHolds' },
			pendingProps: { reason: 'third-party-element' },
			return: null,
		};
		const thirdPartySegmentFiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		ignoreHoldsFiber.return = thirdPartySegmentFiber;
		const node = createMockNode(ignoreHoldsFiber);

		const result = checkWithinComponent(node, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(true);
	});

	it('should find fiber on current element if react fiber available', () => {
		mockFg.mockReturnValue(true);

		const fiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		const node = createMockNode(fiber);

		const result = checkWithinComponent(node, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(true);
	});

	it('should walk up DOM tree when feature flag is enabled and element has no fiber', async () => {
		mockFg.mockReturnValue(true);

		// Create great-grandparent element with fiber
		const greatGrandParentFiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		const greatGrandParentElement = createMockNode(greatGrandParentFiber);

		const grandParentElement = document.createElement('div') as HTMLElement;
		Object.defineProperty(grandParentElement, 'parentElement', {
			value: greatGrandParentElement,
			writable: true,
		});

		const parentElement = document.createElement('div') as HTMLElement;
		Object.defineProperty(parentElement, 'parentElement', {
			value: grandParentElement,
			writable: true,
		});

		// Create child element without fiber
		const childElement = document.createElement('div') as HTMLElement;
		Object.defineProperty(childElement, 'parentElement', {
			value: parentElement,
			writable: true,
		});

		const result = checkWithinComponent(childElement, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(true);
	});

	it('should return false when feature flag is enabled but no fiber found in DOM tree', async () => {
		mockFg.mockReturnValue(true);

		// Create elements without fiber
		const grandParentElement = document.createElement('div') as HTMLElement;
		const parentElement = document.createElement('div') as HTMLElement;
		const childElement = document.createElement('div') as HTMLElement;

		Object.defineProperty(parentElement, 'parentElement', {
			value: grandParentElement,
			writable: true,
		});
		Object.defineProperty(childElement, 'parentElement', {
			value: parentElement,
			writable: true,
		});

		const result = checkWithinComponent(childElement, 'UFOThirdPartySegment', mapIs3pResult);
		expect(result.isWithin).toBe(false);
	});
});
