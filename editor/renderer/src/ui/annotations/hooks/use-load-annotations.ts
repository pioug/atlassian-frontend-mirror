import { useContext, useEffect } from 'react';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import type { AnnotationState } from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import { ProvidersContext } from '../context';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import { useAnnotationManagerDispatch } from '../contexts/AnnotationManagerContext';

export type LoadCompleteHandler = (params: { numberOfUnresolvedInlineComments: number }) => void;

type Props = {
	adfDocument: JSONDocNode;
	isNestedRender: boolean;
	onLoadComplete?: LoadCompleteHandler;
};
export const useLoadAnnotations = ({ adfDocument, isNestedRender, onLoadComplete }: Props) => {
	const actions = useContext(ActionsContext);
	const providers = useContext(ProvidersContext);
	const { annotationManager, dispatch } = useAnnotationManagerDispatch();
	const isAnnotationManagerEnabled = !!annotationManager;

	useEffect(() => {
		if (!providers) {
			return;
		}

		const {
			inlineComment: {
				getState: inlineCommentGetState,
				updateSubscriber: updateSubscriberInlineComment,
			},
		} = providers;

		const annotations = actions.getAnnotationMarks();
		// we don't want to request integrators for state with an empty list of ids.
		if (!annotations.length) {
			if (!isNestedRender) {
				// inlineCommentGetState handles empty lists gracefully. It has a side-effect of clearing state, which is why this call is needed
				inlineCommentGetState([], isNestedRender);
			}
			onLoadComplete &&
				onLoadComplete({
					numberOfUnresolvedInlineComments: 0,
				});
			return;
		}
		const ids = annotations.map((mark) => mark.attrs.id);

		const cb = (data: AnnotationState<AnnotationTypes.INLINE_COMMENT>[]) => {
			if (!updateSubscriberInlineComment) {
				return;
			}

			const payload: Record<
				AnnotationId,
				AnnotationState<AnnotationTypes.INLINE_COMMENT>
			> = data.reduce(
				(acc, value) => ({
					...acc,
					[value.id]: value,
				}),
				{},
			);

			if (isAnnotationManagerEnabled) {
				dispatch({
					type: 'loadAnnotation',
					data: Object.keys(payload).map((id) => ({
						id,
						markState: payload[id].state ?? undefined,
					})),
				});
			} else {
				updateSubscriberInlineComment.emit(AnnotationUpdateEvent.SET_ANNOTATION_STATE, payload);
			}

			onLoadComplete &&
				onLoadComplete({
					numberOfUnresolvedInlineComments: data.filter((data) => data.state === 'active').length,
				});
		};

		inlineCommentGetState(ids, isNestedRender).then(cb);
	}, [
		actions,
		providers,
		adfDocument,
		isNestedRender,
		onLoadComplete,
		dispatch,
		isAnnotationManagerEnabled,
	]);
};
