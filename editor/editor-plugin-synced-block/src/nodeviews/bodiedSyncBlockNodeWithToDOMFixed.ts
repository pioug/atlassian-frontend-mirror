import { bodiedSyncBlock } from '@atlaskit/adf-schema';
import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { NodeSpec, DOMOutputSpec, Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Based on packages/editor/editor-plugin-synced-block/src/nodeviews/bodiedSyncedBlock.tsx
 * Adding correct classnames and structure to the toDOM, necessary for SSR rendering
 */
export const bodiedSyncBlockNodeWithToDOMFixed = (): NodeSpec => {
	return {
		...bodiedSyncBlock,
		toDOM: (node: Node): DOMOutputSpec => {
			const { localId, resourceId } = node.attrs;

			const outerAttrs = {
				class: BodiedSyncBlockSharedCssClassName.prefix,
				'data-bodied-sync-block': '',
				'data-local-id': localId,
				'data-resource-id': resourceId,
			};

			const innerAttrs = {
				class: BodiedSyncBlockSharedCssClassName.content,
			};

			return ['div', outerAttrs, ['div', innerAttrs, 0]];
		},
	};
};
