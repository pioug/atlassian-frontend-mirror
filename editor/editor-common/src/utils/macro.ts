import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export interface Params {
	node: PmNode;
	type: 'image' | 'icon';
}

export const getExtensionLozengeData = ({
	node,
	type,
}: Params): { height?: number; url: string; width?: number } | undefined => {
	if (!node.attrs.parameters) {
		return;
	}
	const { macroMetadata } = node.attrs.parameters;
	// EDITOR-4007: guard against non-array placeholder to prevent `TypeError: ... forEach is not a function`.
	const hasValidPlaceholder = expValEquals(
		'platform_editor_macro_placeholder_array_guard',
		'isEnabled',
		true,
	)
		? macroMetadata && Array.isArray(macroMetadata.placeholder)
		: macroMetadata && macroMetadata.placeholder;
	if (hasValidPlaceholder) {
		let placeholderData;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		macroMetadata.placeholder.forEach((placeholder: { data: any; type: Params['type'] }) => {
			if (placeholder.type === type && placeholder.data && placeholder.data.url) {
				placeholderData = placeholder.data;
			}
		});

		return placeholderData;
	}
	return;
};
