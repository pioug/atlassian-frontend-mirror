import React, { useCallback, useMemo } from 'react';

import { VIEW_METHOD } from '../../analytics';
import { BlockNodeBadges } from '../../block-node-badges';
import { useSharedPluginStateWithSelector } from '../../hooks';
import { CommentBadgeNext } from '../../media-single/CommentBadgeNext';
import type { OptionalPlugin, PublicPluginAPI } from '../../types';
import type { ExtensionAnnotationPlugin, ExtensionCommentBadgeProps } from '../types';

type Props = ExtensionCommentBadgeProps & {
	api: PublicPluginAPI<[OptionalPlugin<ExtensionAnnotationPlugin>]> | undefined;
};

// Owned by the extension node view, like media's badge. Annotation updates only
// render this sibling of the extension content; they never reparent its iframe.
export const ExtensionCommentBadge = ({
	api,
	editorView,
	node,
	getPos,
	container,
}: Props): React.JSX.Element | null => {
	const { annotationState } = useSharedPluginStateWithSelector(api, ['annotation'], (states) => ({
		annotationState: states.annotationState,
	}));
	const drafting = Boolean(
		annotationState?.isDrafting &&
		node.attrs.localId &&
		node.attrs.localId === annotationState.targetNodeId,
	);
	const hasOpenDraft = Boolean(annotationState?.isDrafting);
	const unresolvedIds = useMemo(
		() =>
			node.marks
				.filter(
					(mark) =>
						mark.type.name === 'annotation' &&
						annotationState?.annotations[mark.attrs.id] === false,
				)
				.map((mark) => mark.attrs.id),
		[node.marks, annotationState?.annotations],
	);
	const onClick = useCallback(
		async (event: React.MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();
			if (drafting) {
				return;
			}
			if (hasOpenDraft && !(await api?.annotation?.actions.requestCloseInlineComment())) {
				return;
			}
			// Resolve the current position after the asynchronous discard confirmation.
			const pos = getPos();
			if (
				typeof pos !== 'number' ||
				!Number.isFinite(pos) ||
				pos < 0 ||
				pos >= editorView.state.doc.content.size
			) {
				return;
			}
			const currentNode = editorView.state.doc.nodeAt(pos);
			if (
				currentNode?.type === node.type &&
				currentNode.attrs.localId === node.attrs.localId &&
				api?.annotation?.actions.isBlockNodeSupported(currentNode)
			) {
				api?.annotation?.actions.showCommentForBlockNode(currentNode, VIEW_METHOD.BADGE)(
					editorView.state,
					editorView.dispatch,
				);
			}
		},
		[api, editorView, node, getPos, drafting, hasOpenDraft],
	);

	if (
		!annotationState?.isVisible ||
		node.type.name !== 'extension' ||
		!api?.annotation?.actions.isBlockNodeSupported(node)
	) {
		return null;
	}
	if (!drafting && !unresolvedIds.length) {
		return null;
	}
	const active =
		drafting ||
		(!annotationState.isInlineCommentViewClosed &&
			annotationState.selectedAnnotations.some(({ id }) => unresolvedIds.includes(id)));
	return (
		<BlockNodeBadges element={container}>
			<CommentBadgeNext onClick={onClick} status={active ? 'active' : 'default'} />
		</BlockNodeBadges>
	);
};
