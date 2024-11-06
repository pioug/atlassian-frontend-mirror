import React from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { type JSONDocNode } from '@atlaskit/editor-json-transformer';
import { AnnotationView } from './view';
import { AnnotationsContextWrapper } from './wrapper';
import { type AnnotationsWrapperProps } from './types';
import { ProvidersContext, InlineCommentsStateContext } from './context';
import { type LoadCompleteHandler, useLoadAnnotations } from './hooks/use-load-annotations';
import { useAnnotationStateByTypeEvent } from './hooks/use-events';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { AnnotationRangeProvider } from './contexts/AnnotationRangeContext';
import { AnnotationHoverContext } from './contexts/AnnotationHoverContext';

type LoadAnnotationsProps = {
	adfDocument: JSONDocNode;
	isNestedRender: boolean;
	onLoadComplete?: LoadCompleteHandler;
};

const LoadAnnotations = React.memo<LoadAnnotationsProps>(
	({ adfDocument, isNestedRender, onLoadComplete }) => {
		useLoadAnnotations({ adfDocument, isNestedRender, onLoadComplete });
		return null;
	},
);

// This is used by renderers when setting the data-start-pos attribute on commentable nodes
// By default it is 1 (the possible starting position of any document).
// The bodied extension component then sets a new value for this context based on its on position
// in the document.
export const AnnotationsPositionContext = React.createContext<{ startPos: number }>({
	startPos: 1,
});

export const AnnotationsWrapper = (props: AnnotationsWrapperProps) => {
	const { children, annotationProvider, rendererRef, adfDocument, isNestedRender, onLoadComplete } =
		props;
	const updateSubscriber =
		annotationProvider &&
		annotationProvider.inlineComment &&
		annotationProvider.inlineComment.updateSubscriber;
	const inlineCommentAnnotationsState = useAnnotationStateByTypeEvent({
		type: AnnotationTypes.INLINE_COMMENT,
		updateSubscriber: updateSubscriber || null,
	});
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return (
		<ProvidersContext.Provider value={annotationProvider}>
			<InlineCommentsStateContext.Provider value={inlineCommentAnnotationsState}>
				<AnnotationRangeProvider
					allowCommentsOnMedia={annotationProvider?.inlineComment?.allowCommentsOnMedia ?? false}
				>
					<AnnotationHoverContext>
						<AnnotationsContextWrapper
							createAnalyticsEvent={createAnalyticsEvent}
							rendererRef={rendererRef}
						>
							<LoadAnnotations
								adfDocument={adfDocument}
								isNestedRender={isNestedRender}
								onLoadComplete={onLoadComplete}
							/>
							<AnnotationView
								isNestedRender={isNestedRender}
								createAnalyticsEvent={createAnalyticsEvent}
							/>
							{children}
						</AnnotationsContextWrapper>
					</AnnotationHoverContext>
				</AnnotationRangeProvider>
			</InlineCommentsStateContext.Provider>
		</ProvidersContext.Provider>
	);
};

export { TextWithAnnotationDraft } from './draft';
export { MarkElement as AnnotationMark } from './element';
