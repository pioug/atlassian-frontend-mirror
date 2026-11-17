import { getClosestLayer } from './get-closest-layer';

/**
 * Whether `element` is in the container's own layer, not in a nested layer.
 */
export function isInContainerLayer(element: HTMLElement, container: HTMLElement): boolean {
	return getClosestLayer({ element }) === getClosestLayer({ element: container });
}
