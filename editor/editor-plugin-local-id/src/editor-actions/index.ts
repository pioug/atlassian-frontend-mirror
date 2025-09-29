import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Transform } from '@atlaskit/editor-prosemirror/transform';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import type { ActionProps, LocalIdPlugin } from '../localIdPluginType';

type EditorActionProps = ActionProps;

export function findNodeByLocalId(tr: Transform, localId: string): NodeWithPos | undefined {
	let result: NodeWithPos | undefined;
	tr.doc.descendants((node, pos) => {
		if (result) {
			return false;
		}
		if (node.attrs.localId === localId) {
			result = { node, pos };
		}
		return result === undefined;
	});
	return result;
}

export const replaceNode =
	(api: ExtractInjectionAPI<LocalIdPlugin> | undefined) =>
	({ localId, value }: EditorActionProps & { value: Node }) => {
		const nodeWithPos = getNode(api)({ localId });
		if (!nodeWithPos) {
			return false;
		}
		const { pos, node } = nodeWithPos;
		return (
			api?.core.actions.execute(({ tr }) =>
				tr.replaceWith(pos, pos + node.nodeSize, value).scrollIntoView(),
			) ?? false
		);
	};

export const getNode =
	(api: ExtractInjectionAPI<LocalIdPlugin> | undefined) =>
	({ localId }: EditorActionProps) => {
		let result: NodeWithPos | undefined;
		api?.core.actions.execute(({ tr }) => {
			result = findNodeByLocalId(tr, localId);
			return null;
		});
		return result;
	};
