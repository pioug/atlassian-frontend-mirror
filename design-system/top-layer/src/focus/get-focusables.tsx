import { isNativeElementOpen } from '../internal/is-native-element-open';
import { canTakeFocus } from './can-take-focus';
import { focusableElementSelectors } from './focusable-element-selectors';
import { getNestedLayers } from './get-nested-layers';
import { isFocusOwningLayer } from './is-focus-owning-layer';
import type { TFocusableFilter } from './types';

const focusableExclusions = [
	'[tabindex="-1"]',
	':disabled',
	'[aria-disabled="true"]',
	'[aria-hidden="true"]',
];
const exclusionSelector = focusableExclusions.map((selector) => `:not(${selector})`).join('');

const focusableSelector = focusableElementSelectors
	.map((selector) => `${selector}${exclusionSelector}`)
	.join(',');

/**
 * Returns the focusable elements in `container`, in Tab order (DOM order). It
 * excludes elements that Tab skips (`tabindex="-1"`), disabled, hidden and
 * `inert` elements, and elements that `filter` rejects.
 *
 * Nested layers (`[popover]` or `<dialog>` inside `container`) follow the role
 * rule: an open layer is in the Tab order unless it owns its focus (see
 * `isFocusOwningLayer`). Closed layers are left out.
 */
export function getFocusables({
	container,
	filter,
}: {
	container: HTMLElement;
	filter?: TFocusableFilter;
}): HTMLElement[] {
	// Layers whose content is not in this Tab order: they wrap their own Tab, or are closed.
	const excludedLayers = getNestedLayers({ container }).filter(
		(layer) =>
			isFocusOwningLayer({ layer }) ||
			!(layer instanceof HTMLElement && isNativeElementOpen({ element: layer })),
	);

	return Array.from(container.querySelectorAll(focusableSelector)).filter(
		(element): element is HTMLElement => {
			if (!(element instanceof HTMLElement)) {
				return false;
			}
			const isInExcludedLayer = excludedLayers.some((layer) => layer.contains(element));
			if (isInExcludedLayer) {
				return false;
			}
			// Disabled, inert and hidden elements cannot take focus.
			if (!canTakeFocus({ element })) {
				return false;
			}
			return !filter || filter(element, container);
		},
	);
}
