import { rootElementGap } from '../../ui/consts';

// Adapted from `src/pm-plugins/utils/drag-handle-positions.ts`
// CHANGES - removed parentNodeType, use only for positioning widgets for top level element
// CHANGES - removed layout
// CHANGES - added overrides for constants for widget dimensions
export const getLeftPositionForRootElement = (
	dom: HTMLElement | null,
	nodeType: string,
	widgetDimensions: { height: number; width: number },
	innerContainer?: HTMLElement | null,
	macroInteractionUpdates?: boolean,
): string => {
	if (!dom) {
		return 'auto';
	}

	if (!innerContainer) {
		return `${dom.offsetLeft - rootElementGap(nodeType) - widgetDimensions.width}px`;
	}

	// There is a showMacroInteractionDesignUpdates prop in extension node wrapper that can add a relative span under the top level div
	// We need to adjust the left offset position of the drag handle to account for the relative span
	const relativeSpan: HTMLElement | null = macroInteractionUpdates
		? dom.querySelector('span.relative')
		: null;

	const leftAdjustment = relativeSpan ? relativeSpan.offsetLeft : 0;

	return getComputedStyle(innerContainer).transform === 'none'
		? `${innerContainer.offsetLeft + leftAdjustment - rootElementGap(nodeType) - widgetDimensions.width}px`
		: `${innerContainer.offsetLeft + leftAdjustment - innerContainer.offsetWidth / 2 - rootElementGap(nodeType) - widgetDimensions.width}px`;
};
