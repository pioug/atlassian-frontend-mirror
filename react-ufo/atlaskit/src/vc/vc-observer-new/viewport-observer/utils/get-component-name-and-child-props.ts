import type { UFOIgnoreHoldsReason } from '../../../../ignore-holds';
import type { VCObserverEntryType } from '../../types';

// Using the React Fiber tree to traverse up the DOM and check if a node is within a specific component
// and extract child component props if needed.
export function checkWithinComponentAndExtractChildProps<T = string>(
	node: HTMLElement,
	targetComponentName: string,
	childComponentConfig?: {
		componentName: string;
		propName: string;
		extractValue?: (props: any) => T;
	},
): { isWithin: boolean; childProp?: T } {
	// Get the React fiber from the DOM node
	const key = Object.keys(node).find(
		(key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'),
	);
	if (!key) {
		return { isWithin: false };
	}
	const fiber = (node as any)[key];
	if (!fiber) {
		return { isWithin: false };
	}

	// Traverse up the fiber tree
	let currentFiber = fiber;
	let childProp: T | undefined;

	while (currentFiber) {
		let componentName: string | undefined;
		if (currentFiber.type) {
			if (typeof currentFiber.type === 'function') {
				componentName = currentFiber.type.displayName || currentFiber.type.name;
			} else if (
				typeof currentFiber.type === 'object' &&
				(currentFiber.type.displayName || currentFiber.type.name)
			) {
				componentName = currentFiber.type.displayName || currentFiber.type.name;
			}
		}

		// Check if this is a child component we're looking for
		if (childComponentConfig && componentName === childComponentConfig.componentName) {
			const props = currentFiber.memoizedProps || currentFiber.pendingProps;
			if (props && props[childComponentConfig.propName] !== undefined) {
				// Overwrite with the nearest child prop (closest to the target component)
				childProp = childComponentConfig.extractValue
					? childComponentConfig.extractValue(props)
					: props[childComponentConfig.propName];
			}
		}

		// Check if we found the target component
		if (componentName === targetComponentName) {
			return {
				isWithin: true,
				...(childComponentConfig && { childProp: childProp }),
			};
		}
		currentFiber = currentFiber.return;
	}
	return { isWithin: false };
}

// Check if the node is within a UFOThirdPartySegment and extract any UFOIgnoreHolds reason
export function checkThirdPartySegmentWithIgnoreReason(node: HTMLElement): {
	isWithinThirdPartySegment: boolean;
	ignoredReason?: UFOIgnoreHoldsReason;
} {
	const result = checkWithinComponentAndExtractChildProps<UFOIgnoreHoldsReason>(
		node,
		'UFOThirdPartySegment',
		{
			componentName: 'UFOIgnoreHolds',
			propName: 'reason',
		},
	);

	return {
		isWithinThirdPartySegment: result.isWithin,
		ignoredReason: result.childProp,
	};
}

// Helper function to create mutation type from UFOIgnoreHoldsReason
export function createMutationTypeWithIgnoredReason(
	reason: UFOIgnoreHoldsReason,
): VCObserverEntryType {
	return `mutation:${reason}` as VCObserverEntryType;
}
