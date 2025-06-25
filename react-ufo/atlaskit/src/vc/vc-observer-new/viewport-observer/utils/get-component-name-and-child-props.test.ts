import {
	checkThirdPartySegmentWithIgnoreReason,
	checkWithinComponentAndExtractChildProps,
} from './get-component-name-and-child-props';

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

describe('checkWithinComponentAndExtractChildProps', () => {
	// Use a consistent fiber key for testing
	const fiberKey = '__reactFiber$test';

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
			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent');
			expect(result.isWithin).toBe(false);
			expect(result.childProp).toBeUndefined();
		});

		it('should return false when target component is not found', () => {
			const fiber: MockFiber = {
				key: null,
				type: { name: 'OtherComponent' },
				return: null,
			};
			const node = createMockNode(fiber);
			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent');
			expect(result.isWithin).toBe(false);
			expect(result.childProp).toBeUndefined();
		});

		it('should return true when target component is found', () => {
			const fiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			const node = createMockNode(fiber);
			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent');
			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBeUndefined();
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
			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent');
			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBeUndefined();
		});

		it('should use displayName when available', () => {
			const fiber: MockFiber = {
				key: null,
				type: { displayName: 'TargetComponent', name: 'DifferentName' },
				return: null,
			};
			const node = createMockNode(fiber);
			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent');
			expect(result.isWithin).toBe(true);
		});
	});

	describe('child props extraction', () => {
		it('should get the nearest child component (closest to target component)', () => {
			const farChildFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				memoizedProps: { value: 'far-value' },
				return: null,
			};
			const nearChildFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				memoizedProps: { value: 'near-value' },
				return: null,
			};
			const targetFiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			farChildFiber.return = nearChildFiber;
			nearChildFiber.return = targetFiber;
			const node = createMockNode(farChildFiber);

			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent', {
				componentName: 'ChildComponent',
				propName: 'value',
			});

			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBe('near-value');
		});

		it('should extract child prop when child component is found anywhere in the fiber tree to target component', () => {
			const childFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				memoizedProps: { value: 'test-value' },
				return: null,
			};
			const otherFiber: MockFiber = {
				key: null,
				type: { name: 'OtherComponent' },
				return: null,
			};
			const targetFiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			childFiber.return = otherFiber;
			otherFiber.return = targetFiber;
			const node = createMockNode(childFiber);

			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent', {
				componentName: 'ChildComponent',
				propName: 'value',
			});

			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBe('test-value');
		});

		it('should use custom extractValue function', () => {
			const childFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				memoizedProps: { complexData: { id: 123, name: 'test' } },
				return: null,
			};
			const targetFiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			childFiber.return = targetFiber;
			const node = createMockNode(childFiber);

			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent', {
				componentName: 'ChildComponent',
				propName: 'complexData',
				extractValue: (props) => props.complexData.name,
			});

			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBe('test');
		});

		it('should use pendingProps when memoizedProps is not available', () => {
			const childFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				pendingProps: { value: 'pending-value' },
				return: null,
			};
			const targetFiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			childFiber.return = targetFiber;
			const node = createMockNode(childFiber);

			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent', {
				componentName: 'ChildComponent',
				propName: 'value',
			});

			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBe('pending-value');
		});

		it('should not return childProp when no props are found', () => {
			const childFiber: MockFiber = {
				key: null,
				type: { name: 'ChildComponent' },
				memoizedProps: { otherValue: 'test' },
				return: null,
			};
			const targetFiber: MockFiber = {
				key: null,
				type: { name: 'TargetComponent' },
				return: null,
			};
			childFiber.return = targetFiber;
			const node = createMockNode(childFiber);

			const result = checkWithinComponentAndExtractChildProps(node, 'TargetComponent', {
				componentName: 'ChildComponent',
				propName: 'value',
			});

			expect(result.isWithin).toBe(true);
			expect(result.childProp).toBeUndefined();
		});
	});
});

describe('checkThirdPartySegmentWithIgnoreReason', () => {
	// Use a consistent fiber key for testing
	const fiberKey = '__reactFiber$test';

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
		const result = checkThirdPartySegmentWithIgnoreReason(node);
		expect(result.isWithinThirdPartySegment).toBe(false);
		expect(result.ignoredReason).toBeUndefined();
	});

	it('should return true when within UFOThirdPartySegment without UFOIgnoreHolds', () => {
		const fiber: MockFiber = {
			key: null,
			type: { name: 'UFOThirdPartySegment' },
			return: null,
		};
		const node = createMockNode(fiber);
		const result = checkThirdPartySegmentWithIgnoreReason(node);
		expect(result.isWithinThirdPartySegment).toBe(true);
		expect(result.ignoredReason).toBeUndefined();
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

		const result = checkThirdPartySegmentWithIgnoreReason(node);
		expect(result.isWithinThirdPartySegment).toBe(true);
		expect(result.ignoredReason).toBe('third-party-element');
	});

	it('should get the nearest UFOIgnoreHolds (closest to UFOThirdPartySegment)', () => {
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

		const result = checkThirdPartySegmentWithIgnoreReason(node);
		expect(result.isWithinThirdPartySegment).toBe(true);
		expect(result.ignoredReason).toBe('near-reason');
	});

	it('should use pendingProps when memoizedProps is not available', () => {
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

		const result = checkThirdPartySegmentWithIgnoreReason(node);
		expect(result.isWithinThirdPartySegment).toBe(true);
		expect(result.ignoredReason).toBe('third-party-element');
	});
});
