import type { Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { ExtensionParams, Parameters } from '@atlaskit/editor-common/extensions';

export function markBlockAsInline({
	nodes,
	onMark,
	parentPos,
	shouldDisplayExtensionAsInline,
}: {
	nodes: PMNode[];
	onMark: ({ pos }: { pos: number }) => void;
	parentPos: number;
	shouldDisplayExtensionAsInline: (extensionParams: ExtensionParams<Parameters>) => boolean;
}) {
	if (!nodes || nodes.length === 0 || nodes[0].isInline) {
		return;
	}

	function isInlineBodiedExtension(node?: PMNode | null): boolean {
		return Boolean(
			node?.type.name === 'bodiedExtension' &&
				shouldDisplayExtensionAsInline({
					type: node.type.name,
					extensionKey: node.attrs?.extensionKey,
					extensionType: node.attrs?.extensionType,
					parameters: node.attrs?.parameters,
					content: node.content,
					localId: node.attrs?.localId,
				}),
		);
	}

	try {
		let prevPos = parentPos;
		let pos = parentPos;
		let prevTextBlockType: NodeType | undefined;
		for (const [index, node] of nodes.entries()) {
			const prevNode: PMNode | undefined = nodes[index - 1];

			// textblock + inlinedBodiedExtension
			if (prevNode?.isTextblock && isInlineBodiedExtension(node)) {
				onMark({ pos: prevPos });
			}
			// inlinedBodiedExtension + textblock
			else if (
				isInlineBodiedExtension(prevNode) &&
				node.isTextblock &&
				(!prevTextBlockType || node.type === prevTextBlockType)
			) {
				onMark({ pos });
			}

			if (!isInlineBodiedExtension(node)) {
				prevTextBlockType = node.isTextblock ? node.type : undefined;
			}

			prevPos = pos;
			pos += node.nodeSize;
		}
	} catch {}
}
