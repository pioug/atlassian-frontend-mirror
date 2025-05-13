import React, { useCallback, useContext } from 'react';
import type { AnnotationsDraftContextWrapperChildrenProps } from './context';
import { AnnotationsDraftContextWrapper, ProvidersContext } from './context';
import { RangeValidator as HoverRangeValidator } from './hover/range-validator';
import { SelectionRangeValidator } from './selection/range-validator';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from './contexts/AnnotationRangeContext';

type Props = {
	rendererRef: React.RefObject<HTMLDivElement>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	isNestedRender?: boolean;
};

export const AnnotationsContextWrapperOld = (
	props: React.PropsWithChildren<Props>,
): JSX.Element => {
	const providers = useContext(ProvidersContext);
	const { range, type } = useAnnotationRangeState();
	const { setDraftRange, clearDraftRange } = useAnnotationRangeDispatch();
	const { rendererRef, createAnalyticsEvent, children, isNestedRender } = props;
	const inlineCommentProvider = providers && providers.inlineComment;
	const selectionComponent = inlineCommentProvider && inlineCommentProvider.selectionComponent;
	const hoverComponent = inlineCommentProvider && inlineCommentProvider.hoverComponent;

	// We want to set the draft to the range the user highlighted
	const setRangeForDraft = useCallback(() => {
		setDraftRange(range, type);
	}, [range, setDraftRange, type]);

	const clearRangeForDraft = useCallback(() => {
		clearDraftRange(type);
	}, [type, clearDraftRange]);

	const render = useCallback(
		({
			applyAnnotationDraftAt,
			clearAnnotationDraft,
		}: AnnotationsDraftContextWrapperChildrenProps) => {
			return (
				<>
					{children}
					{!!hoverComponent && (
						<HoverRangeValidator
							createAnalyticsEvent={createAnalyticsEvent}
							rendererRef={rendererRef}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							component={hoverComponent!}
							applyAnnotationDraftAt={applyAnnotationDraftAt}
							clearAnnotationDraft={clearAnnotationDraft}
						/>
					)}
					{!!selectionComponent && (
						<SelectionRangeValidator
							createAnalyticsEvent={createAnalyticsEvent}
							rendererRef={rendererRef}
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							selectionComponent={selectionComponent!}
							applyAnnotationDraftAt={applyAnnotationDraftAt}
							clearAnnotationDraft={clearAnnotationDraft}
						/>
					)}
				</>
			);
		},
		[hoverComponent, selectionComponent, children, rendererRef, createAnalyticsEvent],
	);

	if (!selectionComponent && !hoverComponent) {
		return <>{children}</>;
	}

	return (
		<AnnotationsDraftContextWrapper
			setDraftRange={setRangeForDraft}
			clearDraftRange={clearRangeForDraft}
			isNestedRender={isNestedRender}
		>
			{render}
		</AnnotationsDraftContextWrapper>
	);
};

export const AnnotationsContextWrapperNew = (
	props: React.PropsWithChildren<Props>,
): JSX.Element => {
	const providers = useContext(ProvidersContext);
	const { rendererRef, createAnalyticsEvent, children } = props;
	const inlineCommentProvider = providers && providers.inlineComment;
	const selectionComponent = inlineCommentProvider && inlineCommentProvider.selectionComponent;
	const hoverComponent = inlineCommentProvider && inlineCommentProvider.hoverComponent;

	if (!selectionComponent && !hoverComponent) {
		return <>{children}</>;
	}

	return (
		<>
			{children}
			{!!hoverComponent && (
				<HoverRangeValidator
					createAnalyticsEvent={createAnalyticsEvent}
					rendererRef={rendererRef}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					component={hoverComponent!}
				/>
			)}
			{!!selectionComponent && (
				<SelectionRangeValidator
					createAnalyticsEvent={createAnalyticsEvent}
					rendererRef={rendererRef}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					selectionComponent={selectionComponent!}
				/>
			)}
		</>
	);
};

export const AnnotationsContextWrapper = (props: React.PropsWithChildren<Props>): JSX.Element => {
	if (fg('platform_renderer_annotation_draft_position_fix')) {
		// IMPORTANT: Please make sure the AnnotationsDraftContextWrapper is not used anc cleaned up correctly.
		// This code path completely removes all reliance on that wrapper. Also the applyAnnotationDraftAt & clearAnnotationDraft
		// properties have been made optional and not used. This means when we cleanup we can also remove those properties.
		return (
			<AnnotationsContextWrapperNew
				rendererRef={props.rendererRef}
				createAnalyticsEvent={props.createAnalyticsEvent}
				isNestedRender={props.isNestedRender}
			>
				{props.children}
			</AnnotationsContextWrapperNew>
		);
	} else {
		return (
			<AnnotationsContextWrapperOld
				rendererRef={props.rendererRef}
				createAnalyticsEvent={props.createAnalyticsEvent}
				isNestedRender={props.isNestedRender}
			>
				{props.children}
			</AnnotationsContextWrapperOld>
		);
	}
};
