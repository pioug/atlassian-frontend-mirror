import { type Node as PmNode } from '@atlaskit/editor-prosemirror/model';

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
	if (macroMetadata && macroMetadata.placeholder) {
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
