import React from 'react';

import { AnnotationTypes } from '@atlaskit/adf-schema';
import type {
	AnalyticsEventPayload,
	AnnotationAEP,
	DispatchAnalyticsEvent,
	EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	CONTENT_COMPONENT,
	EVENT_TYPE,
	RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	getAnnotationInlineNodeTypes,
	getRangeInlineNodeNames,
} from '@atlaskit/editor-common/utils';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AnnotationPlugin } from '../annotationPluginType';
import {
	closeComponent,
	createAnnotation,
	removeInlineCommentNearSelection,
	setInlineCommentDraftState,
	updateInlineCommentResolvedState,
} from '../editor-commands';
import {
	getAllAnnotations,
	getAnnotationViewKey,
	getPluginState,
	getSelectionPositions,
} from '../pm-plugins/utils';
import { type AnnotationProviders, AnnotationTestIds } from '../types';

import { AnnotationViewWrapper } from './AnnotationViewWrapper';

const findPosForDOM = (sel: Selection) => {
	const { $from, from } = sel;

	// Retrieve current TextNode
	const index = $from.index();
	const node = index < $from.parent.childCount && $from.parent.child(index);

	// Right edge of a mark.
	if (
		!node &&
		$from.nodeBefore &&
		$from.nodeBefore.isText &&
		$from.nodeBefore.marks.find((mark) => mark.type.name === 'annotation')
	) {
		return from - 1;
	}

	return from;
};

interface InlineCommentViewProps {
	providers: AnnotationProviders;
	editorView: EditorView;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editorAPI: ExtractInjectionAPI<AnnotationPlugin> | undefined;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export function InlineCommentView({
	providers,
	editorView,
	editorAnalyticsAPI,
	editorAPI,
	dispatchAnalyticsEvent,
}: InlineCommentViewProps) {
	// As inlineComment is the only annotation present, this function is not generic
	const { inlineComment: inlineCommentProvider } = providers;
	const { state, dispatch } = editorView;

	const { createComponent: CreateComponent, viewComponent: ViewComponent } = inlineCommentProvider;
	const inlineCommentState = getPluginState(state);

	// bookmark
	const bookmarkSelector = useSharedPluginStateSelector(editorAPI, 'annotation.bookmark', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const bookmark = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? bookmarkSelector
		: inlineCommentState?.bookmark;

	// selectedAnnotations
	const selectedAnnotationsSelector = useSharedPluginStateSelector(
		editorAPI,
		'annotation.selectedAnnotations',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const selectedAnnotations = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? selectedAnnotationsSelector
		: inlineCommentState?.selectedAnnotations;

	// annotations
	const annotationsSelector = useSharedPluginStateSelector(editorAPI, 'annotation.annotations', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const annotations = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? annotationsSelector
		: inlineCommentState?.annotations;

	// isInlineCommentViewClosed
	const isInlineCommentViewClosedSelector = useSharedPluginStateSelector(
		editorAPI,
		'annotation.isInlineCommentViewClosed',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const isInlineCommentViewClosed = editorExperiment(
		'platform_editor_usesharedpluginstateselector',
		true,
	)
		? isInlineCommentViewClosedSelector
		: inlineCommentState?.isInlineCommentViewClosed;

	// isOpeningMediaCommentFromToolbar
	const isOpeningMediaCommentFromToolbarSelector = useSharedPluginStateSelector(
		editorAPI,
		'annotation.isOpeningMediaCommentFromToolbar',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const isOpeningMediaCommentFromToolbar = editorExperiment(
		'platform_editor_usesharedpluginstateselector',
		true,
	)
		? isOpeningMediaCommentFromToolbarSelector
		: inlineCommentState?.isOpeningMediaCommentFromToolbar;

	const annotationsList = getAllAnnotations(editorView.state.doc);

	const selection = getSelectionPositions(
		state,
		editorExperiment('platform_editor_usesharedpluginstateselector', true)
			? {
					bookmark,
				}
			: inlineCommentState,
	);
	const position = findPosForDOM(selection);
	let dom: HTMLElement | undefined;
	try {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		dom = findDomRefAtPos(position, editorView.domAtPos.bind(editorView)) as HTMLElement;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn(error);
		if (dispatchAnalyticsEvent) {
			const payload: AnalyticsEventPayload = {
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					component: CONTENT_COMPONENT.INLINE_COMMENT,
					selection: selection.toJSON(),
					position,
					docSize: editorView.state.doc.nodeSize,
					error: (error as Error).toString(),
				},
			};
			dispatchAnalyticsEvent(payload);
		}
	}

	// selectAnnotationMethod
	const selectAnnotationMethodSelector = useSharedPluginStateSelector(
		editorAPI,
		'annotation.selectAnnotationMethod',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);

	if (!dom) {
		return null;
	}

	// Create Component
	if (bookmark) {
		if (!CreateComponent) {
			return null;
		}

		const inlineNodeTypes = getRangeInlineNodeNames({ doc: state.doc, pos: selection });

		//getting all text between bookmarked positions
		const textSelection = state.doc.textBetween(selection.from, selection.to);
		return (
			<div data-testid={AnnotationTestIds.floatingComponent} data-editor-popup="true">
				<CreateComponent
					dom={dom}
					textSelection={textSelection}
					onCreate={(id) => {
						if (!fg('platform_editor_comments_api_manager')) {
							const createAnnotationResult = createAnnotation(editorAnalyticsAPI, editorAPI)(
								id,
								AnnotationTypes.INLINE_COMMENT,
								inlineCommentProvider.supportedBlockNodes,
							)(editorView.state, editorView.dispatch);
							!editorView.hasFocus() && editorView.focus();

							if (!createAnnotationResult && fg('confluence_frontend_handle_annotation_error')) {
								throw new Error('Failed to create annotation');
							}
						}
					}}
					onClose={() => {
						if (!fg('platform_editor_comments_api_manager')) {
							setInlineCommentDraftState(editorAnalyticsAPI)(false)(
								editorView.state,
								editorView.dispatch,
							);
							!editorView.hasFocus() && editorView.focus();
						}
					}}
					inlineNodeTypes={inlineNodeTypes}
					isOpeningMediaCommentFromToolbar={isOpeningMediaCommentFromToolbar}
				/>
			</div>
		);
	}

	// View Component
	const activeAnnotations =
		selectedAnnotations?.filter((mark) => annotations && annotations[mark.id] === false) || [];
	if (!ViewComponent || activeAnnotations.length === 0) {
		return null;
	}

	const onAnnotationViewed = () => {
		if (!dispatchAnalyticsEvent) {
			return;
		}

		// fire analytics
		const payload: AnnotationAEP = {
			action: ACTION.VIEWED,
			actionSubject: ACTION_SUBJECT.ANNOTATION,
			actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				overlap: activeAnnotations.length ? activeAnnotations.length - 1 : 0,
				targetNodeType: editorView.state.doc.nodeAt(position)?.type.name,
				method: editorExperiment('platform_editor_tables_table_selector', true)
					? selectAnnotationMethodSelector
					: inlineCommentState?.selectAnnotationMethod,
			},
		};
		dispatchAnalyticsEvent(payload);
	};

	if (isInlineCommentViewClosed || !selectedAnnotations) {
		return null;
	}

	// For view mode, the finding of inline node types is a bit more complex,
	// that's why we will not provide it as a `inlineNodeTypes` props to the view component,
	// to speed up the rendering process.
	const getInlineNodeTypes = (annotationId: string) =>
		getAnnotationInlineNodeTypes(editorView.state, annotationId);

	return (
		<AnnotationViewWrapper
			data-editor-popup="true"
			data-testid={AnnotationTestIds.floatingComponent}
			key={getAnnotationViewKey(activeAnnotations)}
			onViewed={onAnnotationViewed}
		>
			<ViewComponent
				annotationsList={annotationsList}
				annotations={activeAnnotations}
				getInlineNodeTypes={getInlineNodeTypes}
				dom={dom}
				onDelete={(id) =>
					removeInlineCommentNearSelection(id, inlineCommentProvider.supportedBlockNodes)(
						editorView.state,
						dispatch,
					)
				}
				onResolve={(id) =>
					updateInlineCommentResolvedState(editorAnalyticsAPI)(
						{ [id]: true },
						RESOLVE_METHOD.COMPONENT,
					)(editorView.state, editorView.dispatch)
				}
				onClose={() => {
					closeComponent()(editorView.state, editorView.dispatch);
				}}
				isOpeningMediaCommentFromToolbar={isOpeningMediaCommentFromToolbar}
			/>
		</AnnotationViewWrapper>
	);
}
