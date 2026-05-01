/**
 * Attributes that Pragmatic Drag and Drop adds via `setAttribute` during its
 * post-paint registration step. They are used purely for hit testing and
 * registration bookkeeping, and do not affect layout, paint, or visible
 * styling, so they are safe to ignore for VC measurement.
 *
 * Drop target attributes follow `data-drop-target-for-<typeKey>` and are
 * handled by the prefix below (covers shipped and custom adapters).
 */
export const PDND_REGISTRATION_ATTRIBUTES: ReadonlySet<string> = new Set([
	// @atlaskit/pragmatic-drag-and-drop (core)
	'draggable',
	// Honey pot lives on a transient element; included for completeness.
	'data-pdnd-honey-pot',

	// @atlaskit/pragmatic-drag-and-drop-auto-scroll
	'data-auto-scrollable',

	// @atlaskit/pragmatic-drag-and-drop/react-beautiful-dnd-migration
	'data-rbd-draggable-droppable-id',
	'data-rbd-draggable-index',
	'data-rbd-droppable-type',
	'data-rbd-droppable-direction',
	'data-rbd-droppable-id',
	'data-rbd-droppable-context-id',
	'data-rbd-style-context-id',
]);

export const DROP_TARGET_ATTRIBUTE_PREFIX = 'data-drop-target-for-';

/**
 * Name-only match (rbd-migration attributes carry dynamic values).
 */
export default function isPdndAttribute({
	target,
	attributeName,
}: {
	target?: Node | null;
	attributeName?: string | null;
}): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	if (!attributeName) {
		return false;
	}

	if (PDND_REGISTRATION_ATTRIBUTES.has(attributeName)) {
		return true;
	}

	if (attributeName.startsWith(DROP_TARGET_ATTRIBUTE_PREFIX)) {
		return true;
	}

	return false;
}
