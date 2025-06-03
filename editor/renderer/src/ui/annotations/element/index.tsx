import React, { useMemo, useCallback, useContext } from 'react';
import {
	type AnnotationId,
	type AnnotationDataAttributes,
	AnnotationMarkStates,
	type AnnotationTypes,
} from '@atlaskit/adf-schema';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common/types';

import { MarkComponent } from './mark';
import { useInlineCommentsFilter } from '../hooks/use-inline-comments-filter';
import { useInlineCommentSubscriberContext } from '../hooks/use-inline-comment-subscriber';
import { useHasFocusEvent } from '../hooks/use-events';
import { InlineCommentsStateContext } from '../context';
import type { OnAnnotationClickPayload } from '@atlaskit/editor-common/types';
import { useAnnotationManagerDispatch } from '../contexts/AnnotationManagerContext';

type MarkElementProps = React.PropsWithChildren<{
	id: AnnotationId;
	annotationParentIds: AnnotationId[];
	dataAttributes: AnnotationDataAttributes;
	annotationType: AnnotationTypes;
	useBlockLevel?: boolean;
}>;

const MarkElement = ({
	annotationParentIds,
	children,
	dataAttributes,
	id,
	useBlockLevel,
}: MarkElementProps) => {
	const updateSubscriber = useInlineCommentSubscriberContext();
	const states = useContext(InlineCommentsStateContext);
	const { hasFocus, isHovered } = useHasFocusEvent({ id, updateSubscriber });
	const dataAttributesMemorized = useMemo(() => dataAttributes, [dataAttributes]);
	const { dispatch, annotationManager } = useAnnotationManagerDispatch();

	const onClick = useCallback(
		(props: OnAnnotationClickPayload) => {
			if (!updateSubscriber) {
				return;
			}

			if (useBlockLevel) {
				return;
			}

			const { eventTarget, annotationIds } = props;

			if (annotationManager) {
				if (hasFocus) {
					dispatch({
						type: 'resetSelectedAnnotation',
					});
					return;
				}

				annotationManager
					.checkPreemptiveGate()
					.then((canSelect) => {
						if (canSelect) {
							// if there is a draft, clear it first
							annotationManager?.clearDraft();

							// use setIsAnnotationSelected won't work here if there is a draft in progress
							// so we need to use dispatch to update the state directly
							dispatch({
								type: 'updateAnnotation',
								data: {
									id: annotationIds[0],
									selected: true,
								},
							});

							dispatch({
								type: 'setSelectedMarkRef',
								data: {
									markRef: eventTarget,
								},
							});
						} else {
							// TODO: EDITOR-595 - If the preemptive gate returns false, should we track the analytics event?
						}
					})
					.catch((error) => {
						// TODO: EDITOR-595 - An error occurred while checking the preemptive gate. We should report this error.
					});
			} else {
				updateSubscriber.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
					annotationIds,
					eventTarget,
				});
			}
		},
		[updateSubscriber, useBlockLevel, dispatch, annotationManager, hasFocus],
	);

	const activeParentIds = useInlineCommentsFilter({
		annotationIds: annotationParentIds,
		filter: {
			state: AnnotationMarkStates.ACTIVE,
		},
	});

	return (
		<MarkComponent
			id={id}
			dataAttributes={dataAttributesMemorized}
			annotationParentIds={activeParentIds}
			onClick={onClick}
			hasFocus={hasFocus}
			isHovered={isHovered}
			state={states[id]}
			useBlockLevel={useBlockLevel}
		>
			{children}
		</MarkComponent>
	);
};

export { MarkElement };
