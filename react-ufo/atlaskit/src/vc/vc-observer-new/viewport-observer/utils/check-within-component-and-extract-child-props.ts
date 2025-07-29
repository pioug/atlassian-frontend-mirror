import { fg } from '@atlaskit/platform-feature-flags';

import findReactFiber from './find-react-fiber';
import getComponentName from './get-component-name';

const DEFAULT_MAX_LEVEL = 20;
// Using the React Fiber tree to traverse up the DOM and check if a node is within a specific component
// and extract child component props if needed.
export default function checkWithinComponentAndExtractChildProps<T = string>(
	node: HTMLElement,
	targetComponentName: string,
	childComponentConfig?: {
		componentName: string;
		propName: string;
		extractValue?: (props: any) => T;
	},
): { isWithin: boolean; childProp?: T } {
	let fiber = null;
	if (fg('platform_ufo_handle_non_react_element_for_3p')) {
		// Walk up the DOM tree to find React fiber (handles non-React-rendered elements)
		let currentElement: HTMLElement | null = node;
		let levelsTraversed = 0;
		while (currentElement && !fiber && levelsTraversed < DEFAULT_MAX_LEVEL) {
			fiber = findReactFiber(currentElement);
			if (!fiber) {
				currentElement = currentElement.parentElement as HTMLElement;
			}
			levelsTraversed++;
		}
	} else {
		fiber = findReactFiber(node);
	}

	// If no React fiber found, return false
	if (!fiber) {
		return { isWithin: false };
	}

	// Traverse up the fiber tree
	let currentFiber = fiber;
	let childProp: T | undefined;

	while (currentFiber) {
		const componentName = getComponentName(currentFiber);

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
