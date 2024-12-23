import { uuid } from '@atlaskit/adf-schema';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';

import { mapFragment } from '../utils/slice';

/**
 * Lift content out of "open" top-level bodiedExtensions.
 * Will not work if bodiedExtensions are nested, or when bodiedExtensions are not in the top level
 */
export const transformSliceToRemoveOpenBodiedExtension = (slice: Slice, schema: Schema) => {
	const { bodiedExtension } = schema.nodes;

	const fragment = mapFragment(slice.content, (node, parent, index) => {
		if (node.type === bodiedExtension && !parent) {
			const currentNodeIsAtStartAndIsOpen = slice.openStart && index === 0;
			const currentNodeIsAtEndAndIsOpen = slice.openEnd && index + 1 === slice.content.childCount;

			if (currentNodeIsAtStartAndIsOpen || currentNodeIsAtEndAndIsOpen) {
				return node.content;
			}
		}
		return node;
	});

	// If the first/last child has changed - then we know we've removed a bodied extension & to decrement the open depth
	return new Slice(
		fragment,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fragment.firstChild && fragment.firstChild!.type !== slice.content.firstChild!.type
			? slice.openStart - 1
			: slice.openStart,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fragment.lastChild && fragment.lastChild!.type !== slice.content.lastChild!.type
			? slice.openEnd - 1
			: slice.openEnd,
	);
};

/**
 * Lift content out of "open" top-level multiBodiedExtensions.
 * Will not work if multiBodiedExtensions are nested, or when multiBodiedExtensions are not in the top level, which should never happen
 */
export const transformSliceToRemoveOpenMultiBodiedExtension = (slice: Slice, schema: Schema) => {
	const { multiBodiedExtension, extensionFrame } = schema.nodes;

	let depthToReduce = 2; // Removing MBE and extensionFrame

	// Edge case where the slice does not contain extensionFrames under MBE, happens when multiple block nodes get copied from a frame
	if (
		slice.content.firstChild?.type === multiBodiedExtension &&
		slice.content.firstChild?.firstChild?.type !== extensionFrame
	) {
		depthToReduce = 1;
	}

	let fragment = mapFragment(slice.content, (node, parent, index) => {
		if ((node.type === multiBodiedExtension && !parent) || node.type === extensionFrame) {
			const currentNodeIsAtStartAndIsOpen = slice.openStart >= depthToReduce && index === 0;
			const currentNodeIsAtEndAndIsOpen =
				slice.openEnd >= depthToReduce && index + 1 === slice.content.childCount;

			if (currentNodeIsAtStartAndIsOpen || currentNodeIsAtEndAndIsOpen) {
				return node.content;
			}
		}
		if (node.type === multiBodiedExtension) {
			/* While pasting on the same page, macroId does not change until the page is published and causes collision with the existing macroId
			 *  where switching tabs of one node changes the tabs for the other node, so we put a random macroId at paste to avoid collision
			 */
			if (node.attrs.parameters?.macroMetadata?.macroId?.value) {
				node.attrs.parameters.macroMetadata.macroId.value = uuid.generate();
			}
		}
		return node;
	});

	// If the first/last child has changed - then we know we've removed MBE and extensionFrame and need to decrement the open depth
	return new Slice(
		fragment,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fragment.firstChild && fragment.firstChild!.type !== slice.content.firstChild!.type
			? slice.openStart - depthToReduce
			: slice.openStart,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fragment.lastChild && fragment.lastChild!.type !== slice.content.lastChild!.type
			? slice.openEnd - depthToReduce
			: slice.openEnd,
	);
};
