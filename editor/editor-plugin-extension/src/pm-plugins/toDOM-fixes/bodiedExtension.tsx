import { bodiedExtension } from '@atlaskit/adf-schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

// @nodeSpecException:toDOM patch
export const bodiedExtensionSpecWithFixedToDOM = () => {
	return {
		...bodiedExtension,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const attrs = {
				'data-node-type': 'bodied-extension',
				'data-extension-type': node.attrs.extensionType,
				'data-extension-key': node.attrs.extensionKey,
				'data-text': node.attrs.text,
				'data-parameters': JSON.stringify(node.attrs.parameters),
				'data-layout': node.attrs.layout,
				'data-local-id:': node.attrs.localId,
				style: convertToInlineCss({
					position: 'relative',
					marginTop: token('space.300'),
				}),
			};

			const title =
				(node.attrs && node.attrs.extensionTitle) ||
				(node.attrs && node.attrs.macroMetadata && node.attrs.macroMetadata.title) ||
				node.attrs.extensionKey;

			return [
				'div',
				attrs,
				[
					'span',
					{
						// Styles based on `packages/editor/editor-common/src/extensibility/Extension/Lozenge/ExtensionLabel.tsx`
						style: convertToInlineCss({
							boxShadow: `0 0 0 1px ${token('color.border', N30)}`,
							fontSize: '14px',
							padding: `${token('space.025')} ${token('space.050')}`,
							color: token('color.text.subtle'),
							borderTopLeftRadius: token('border.radius'),
							borderTopRightRadius: token('border.radius'),
							lineHeight: 1,
							position: 'absolute',
							top: '-19px',
						}),
						// If we put this below inside the span then we serialise the label (which causes the label to be
						// be copied to the clipboard causing copy-paste issues).
						// So instead we use a pseudo-element to add the title to this class
						'data-bodied-extension-label': capitalizeFirstLetter(title),
						class: 'bodied-extension-to-dom-label',
					},
				],
				[
					'div',
					{
						style: convertToInlineCss({
							padding: token('space.200'),
							marginLeft: token('space.negative.150'),
							marginRight: token('space.negative.150'),
							boxShadow: `0 0 0 1px ${token('color.border', N30)}`,
							borderRadius: token('border.radius'),
						}),
					},
					0,
				],
			];
		},
	};
};
