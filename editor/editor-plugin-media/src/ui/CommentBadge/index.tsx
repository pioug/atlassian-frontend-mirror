import React, { useCallback, useMemo, useState } from 'react';

import type { AnnotationMarkDefinition } from '@atlaskit/adf-schema';
import { VIEW_METHOD } from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { CommentBadgeNext } from '@atlaskit/editor-common/media-single';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaNextEditorPluginType } from '../../mediaPluginType';
import type { getPosHandler } from '../../types';

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaNextEditorPluginType>,
		'annotation'
	>,
) => {
	return {
		selectedAnnotations: states.annotationState?.selectedAnnotations,
		isInlineCommentViewClosed: states.annotationState?.isInlineCommentViewClosed,
		annotations: states.annotationState?.annotations,
	};
};

type CommentBadgeWrapperProps = {
	api?: ExtractInjectionAPI<MediaNextEditorPluginType>;
	getPos: getPosHandler;
	isDrafting?: boolean;
	marks?: AnnotationMarkDefinition[];
	mediaNode: PMNode | null;
	mediaSingleElement?: HTMLElement | null;
	view: EditorView;
};

export const CommentBadgeWrapper = ({
	api,
	mediaNode,
	view,
	getPos,
	isDrafting,
}: CommentBadgeWrapperProps): React.JSX.Element | null => {
	const [entered, setEntered] = useState(false);
	const { selectedAnnotations, isInlineCommentViewClosed, annotations } =
		useSharedPluginStateWithSelector(api, ['annotation'], selector);

	const {
		state: {
			schema: {
				nodes: { media },
				marks: { annotation },
			},
		},
		state,
		dispatch,
	} = view;

	const status = useMemo(() => {
		if (!selectedAnnotations || !mediaNode) {
			return 'default';
		}

		return selectedAnnotations.some(
			(annotation) => !!mediaNode.marks.find((mark) => mark.attrs.id === annotation.id),
		) && !isInlineCommentViewClosed
			? 'active'
			: 'default';
	}, [selectedAnnotations, isInlineCommentViewClosed, mediaNode]);

	const onClick = useCallback(() => {
		if (api?.annotation && mediaNode) {
			const { showCommentForBlockNode } = api.annotation.actions;
			showCommentForBlockNode(mediaNode, VIEW_METHOD.BADGE)(state, dispatch);
		}
	}, [api?.annotation, dispatch, mediaNode, state]);

	const pos = getPos();

	const hasNoComments =
		!Number.isFinite(pos) ||
		!annotations ||
		!mediaNode ||
		mediaNode.type !== media ||
		mediaNode.marks.every(
			(maybeAnnotation) =>
				maybeAnnotation.type !== annotation ||
				!(maybeAnnotation.attrs.id in annotations) ||
				annotations[maybeAnnotation.attrs.id],
		);

	if ((!isDrafting && hasNoComments) || !mediaNode) {
		return null;
	}

	const maybeMediaSingleElement = view.domAtPos((pos as number) + 1).node;
	const mediaSingleElement =
		maybeMediaSingleElement instanceof HTMLElement ? maybeMediaSingleElement : null;

	return (
		<CommentBadgeNext
			onClick={onClick}
			mediaSingleElement={mediaSingleElement}
			status={entered ? 'entered' : status}
			onMouseEnter={() => setEntered(true)}
			onMouseLeave={() => setEntered(false)}
		/>
	);
};
