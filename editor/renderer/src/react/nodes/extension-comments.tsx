/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { jsx, css } from '@compiled/react';

import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { VIEW_METHOD } from '@atlaskit/editor-common/analytics';
import { CommentBadgeNext } from '@atlaskit/editor-common/media-single';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import type { AnnotationUpdateEventPayloads } from '@atlaskit/editor-common/types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import { token } from '@atlaskit/tokens';

import { useAnnotationManagerState } from '../../ui/annotations/contexts/AnnotationManagerContext';
import { useAnnotationRangeState } from '../../ui/annotations/contexts/AnnotationRangeContext';
import { useInlineCommentSubscriberContext } from '../../ui/annotations/hooks/use-inline-comment-subscriber';
import { useInlineCommentsFilter } from '../../ui/annotations/hooks/use-inline-comments-filter';
import AnnotationComponent from '../marks/annotation';

type Props = React.PropsWithChildren<{
	allowAnnotations?: boolean;
	allowAnnotationsDraftMode?: boolean;
	enabled?: boolean;
	marks?: readonly Mark[];
	startPos?: number;
}>;

const containerStyles = css({ position: 'relative' });
const annotationParentIds: string[] = [];
const annotationDataAttributes: { 'data-renderer-mark': true; 'data-block-mark': true } = {
	'data-renderer-mark': true,
	'data-block-mark': true,
};
const badgeStyles = css({
	position: 'absolute',
	top: token('space.100'),
	right: token('space.100'),
});

const ExtensionCommentsEnabled = ({
	marks,
	children,
	enabled,
	allowAnnotations,
	allowAnnotationsDraftMode,
	startPos,
}: Props): React.JSX.Element => {
	const { hoverDraftDocumentPosition } = useAnnotationRangeState();
	const isDraft = Boolean(
		enabled &&
		allowAnnotationsDraftMode &&
		hoverDraftDocumentPosition &&
		hoverDraftDocumentPosition.from + 1 === startPos,
	);
	const updateSubscriber = useInlineCommentSubscriberContext();
	const annotationIds = useMemo(
		() =>
			marks?.filter((mark) => mark.type.name === 'annotation').map((mark) => mark.attrs.id) ?? [],
		[marks],
	);
	const activeIds = useInlineCommentsFilter({
		annotationIds,
		filter: { state: AnnotationMarkStates.ACTIVE },
	});
	const [focusedId, setFocusedId] = useState<string>();
	const [entered, setEntered] = useState(false);
	const { currentSelectedAnnotationId } = useAnnotationManagerState();
	const active = activeIds.some((id) => id === focusedId || id === currentSelectedAnnotationId);

	useEffect(() => {
		if (!updateSubscriber) {
			return;
		}
		const onFocus = (
			payload: AnnotationUpdateEventPayloads[AnnotationUpdateEvent.SET_ANNOTATION_FOCUS],
		) => setFocusedId(payload?.annotationId);
		const onBlur = () => setFocusedId(undefined);
		updateSubscriber.on(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, onFocus);
		updateSubscriber.on(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS, onBlur);
		return () => {
			updateSubscriber.off(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, onFocus);
			updateSubscriber.off(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS, onBlur);
		};
	}, [updateSubscriber]);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();
			// Anchor the thread to this chart, not an icon inside the badge or a nested renderer.
			const extension = event.currentTarget.closest<HTMLElement>('.ak-renderer-extension');
			if (extension && activeIds.length) {
				updateSubscriber?.emit(AnnotationUpdateEvent.ON_ANNOTATION_CLICK, {
					annotationIds: activeIds,
					eventTarget: extension,
					eventTargetType: 'extension',
					viewMethod: VIEW_METHOD.BADGE,
				});
			}
		},
		[activeIds, updateSubscriber],
	);
	const onMouseEnter = useCallback(() => setEntered(true), []);
	const onMouseLeave = useCallback(() => setEntered(false), []);

	return (
		<div
			css={containerStyles}
			data-annotation-draft-mark={isDraft || undefined}
			data-renderer-mark={isDraft || undefined}
			data-renderer-start-pos={isDraft ? startPos : undefined}
		>
			{children}
			{allowAnnotations &&
				annotationIds.map((id) => (
					<AnnotationComponent
						key={id}
						id={id}
						annotationType={AnnotationTypes.INLINE_COMMENT}
						annotationParentIds={annotationParentIds}
						allowAnnotations
						useBlockLevel
						isExtension
						dataAttributes={annotationDataAttributes}
					/>
				))}
			{enabled && activeIds.length > 0 && updateSubscriber && (
				<div css={badgeStyles}>
					<CommentBadgeNext
						status={active ? 'active' : entered ? 'entered' : 'default'}
						onClick={onClick}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					/>
				</div>
			)}
		</div>
	);
};

/** Only node-aware provider-approved extensions receive comment visuals. */
export const ExtensionComments = (props: Props): React.JSX.Element => {
	if (!props.enabled && !props.allowAnnotations) {
		return <>{props.children}</>;
	}
	return (
		<ExtensionCommentsEnabled
			enabled={props.enabled}
			allowAnnotations={props.allowAnnotations}
			allowAnnotationsDraftMode={props.allowAnnotationsDraftMode}
			startPos={props.startPos}
			marks={props.marks}
		>
			{props.children}
		</ExtensionCommentsEnabled>
	);
};
