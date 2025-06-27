import { fg } from '@atlaskit/platform-feature-flags';

import { getActiveInteraction } from '../interaction-metrics';
import getElementName, { type SelectorConfig } from '../vc/vc-observer-new/get-unique-element-name';

let performanceEventObserver: PerformanceObserver | undefined;

const selectorConfig: SelectorConfig = { id: true, testId: true, role: true, className: true };

type ReactFiberType = {
	memoizedProps?: Record<string, string>;
	type: { displayName: any; name: any };
	return: ReactFiberType | null;
};

function getTestIdName(memoizedProps: Record<string, string>): string | null {
	if (memoizedProps['data-testid']) {
		return `[data-testid=${memoizedProps['data-testid']}]`;
	} else if (memoizedProps['data-test-id']) {
		return `[data-test-id=${memoizedProps['data-testid']}]`;
	}
	return null;
}

function getReactComponentHierarchy(element: HTMLElement) {
	const componentHierarchy: string[] = [];
	// Function to traverse up the fiber tree
	function traverseFiber(fiber: ReactFiberType) {
		let currentFiber: null | ReactFiberType = fiber;
		while (currentFiber) {
			if (currentFiber.type) {
				// Check if there's a display name or a function name
				const componentName = currentFiber.type.displayName || currentFiber.type.name;
				// checking when component name is bigger than the minimized name produced by react
				if (
					componentName &&
					componentName.length > 2 &&
					!componentName.includes('Listener') &&
					!componentName.includes('Provider')
				) {
					componentHierarchy.push(componentName);
				}
				if (componentName === 'UFOSegment') {
					break;
				}
			}
			if (currentFiber.memoizedProps) {
				const dataIdInfo = getTestIdName(currentFiber.memoizedProps);
				if (dataIdInfo) {
					componentHierarchy.push(dataIdInfo);
					currentFiber = null;
					continue;
				}
			}
			currentFiber = currentFiber.return;
		}
	}
	// Access the reactFiber node from the HTML element
	const reactFiberKey = Object.keys(element).find((key) => key.startsWith('__reactFiber$'));
	if (reactFiberKey) {
		const fiber = (element as any)[reactFiberKey];
		traverseFiber(fiber);
	}
	return componentHierarchy.reverse().join(' > ');
}

export const getPerformanceObserver = (): PerformanceObserver => {
	performanceEventObserver =
		performanceEventObserver ||
		new PerformanceObserver((entries: PerformanceObserverEntryList) => {
			const list = entries.getEntries();
			for (let entry of list) {
				if (entry.name === 'click') {
					setInteractionPerformanceEvent(entry as PerformanceEventTiming);
				}
			}
		});
	return performanceEventObserver;
};

export const setInteractionPerformanceEvent = (entry: PerformanceEventTiming) => {
	const interaction = getActiveInteraction();
	if (interaction?.type === 'press') {
		// if happens there is another event interaction that has started after
		// the initial one, we don't want to replace the values if they have already been set up
		interaction.responsiveness = {
			...interaction.responsiveness,
			experimentalInputToNextPaint:
				interaction.responsiveness?.experimentalInputToNextPaint || entry.duration,
			inputDelay: interaction.responsiveness?.inputDelay || entry.processingStart - entry.startTime,
		};
		// if the entry start time is lower than the one in the interaction
		// it means the interaction start time is not accurate, we assign
		// this value which will match the timestamp in the event
		interaction.start = Math.min(interaction.start, entry.startTime);

		if (
			interaction.ufoName === 'unknown' &&
			fg('platform_ufo_enable_unknown_interactions_elements')
		) {
			if (entry.target) {
				const componentHierarchy = getReactComponentHierarchy(entry.target as HTMLElement);
				interaction.unknownElementHierarchy = componentHierarchy;
			}
			interaction.unknownElementName = getElementName(selectorConfig, entry.target as HTMLElement);
		}
	}
};
