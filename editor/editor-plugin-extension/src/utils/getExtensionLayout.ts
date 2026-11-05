import type { Layout } from '@atlaskit/adf-schema/extensions';
import { getBreakoutWidth } from '@atlaskit/editor-common/extensibility/get-breakout-width';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorCalculatedWideLayoutWidth,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles/constants';

const extensionPresetWidths: Readonly<Record<'default' | 'wide' | 'full-width', number>> = {
	default: akEditorDefaultLayoutWidth,
	wide: akEditorCalculatedWideLayoutWidth,
	'full-width': akEditorFullWidthLayoutWidth,
};

export const getExtensionPresetWidth = (layout: 'default' | 'wide' | 'full-width'): number =>
	extensionPresetWidths[layout];

/**
 * getExtensionLayout tries to match the breakout mark's width (if any) to an extension layout preset.
 * @returns the layout preset if the breakout width matches, null if there is no match, or
 * the node's layout attribute if there is no breakout width.
 */
export const getExtensionLayout = (node: Node): Layout | null => {
	const { layout = 'default' } = node.attrs;
	const breakoutWidth = getBreakoutWidth(node.marks);
	if (breakoutWidth !== undefined) {
		if (breakoutWidth === extensionPresetWidths.default) {
			return 'default';
		}
		if (breakoutWidth === extensionPresetWidths.wide) {
			return 'wide';
		}
		if (breakoutWidth === extensionPresetWidths['full-width']) {
			return 'full-width';
		}
		return null;
	}
	// if there is no breakout width, return the node's layout attribute
	return layout;
};
