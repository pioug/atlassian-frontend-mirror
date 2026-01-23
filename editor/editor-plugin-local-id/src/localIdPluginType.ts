import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export type ActionProps = {
	localId: string;
};

export type LocalIdPlugin = NextEditorPlugin<
	'localId',
	{
		actions: {
			/**
			 * Get the node with its position in the document
			 *
			 * @param props.localId Local id of the node in question
			 * @returns { node: ProsemirrorNode, pos: number } Object containing prosemirror node and position in the document
			 */
			getNode: (props: ActionProps) => NodeWithPos | undefined;
			/**
			 * Replace the node in the document by its local id
			 *
			 * @param props.localId Local id of the node in question
			 * @param props.value Prosemirror node to replace the node with
			 * @returns boolean if the replace was successful
			 */
			replaceNode: (props: ActionProps & { value: Node }) => boolean;
		};
		dependencies: [CompositionPlugin];
	}
>;
