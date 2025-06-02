import React, { useContext } from 'react';
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
import { AnnotationManagerProvider } from './contexts/AnnotationManagerContext';

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

export const AnnotationsWrapperInner = (
	props: Omit<AnnotationsWrapperProps, 'annotationProvider'>,
) => {
	const { children, rendererRef, adfDocument, isNestedRender, onLoadComplete } = props;
	const providers = useContext(ProvidersContext);
	const updateSubscriber =
		providers && providers.inlineComment && providers.inlineComment.updateSubscriber;
	const inlineCommentAnnotationsState = useAnnotationStateByTypeEvent({
		type: AnnotationTypes.INLINE_COMMENT,
		updateSubscriber: updateSubscriber || null,
	});
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return (
		<InlineCommentsStateContext.Provider value={inlineCommentAnnotationsState}>
			<AnnotationRangeProvider
				allowCommentsOnMedia={providers?.inlineComment?.allowCommentsOnMedia ?? false}
				isNestedRender={isNestedRender}
			>
				<AnnotationHoverContext>
					<AnnotationsContextWrapper
						createAnalyticsEvent={createAnalyticsEvent}
						rendererRef={rendererRef}
						isNestedRender={isNestedRender}
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
	);
};

export const AnnotationsWrapper = (props: AnnotationsWrapperProps) => {
	const { children, annotationProvider, rendererRef, adfDocument, isNestedRender, onLoadComplete } =
		props;

	if (!isNestedRender && annotationProvider?.annotationManager) {
		// We need to ensure there is a single instance of the annotation manager for the whole document
		// and that it is the same instance for all annotations.
		// This is because the annotation manager is responsible for managing the state of ALL annotations.
		// This includes annotations inside extensions.
		return (
			<ProvidersContext.Provider value={annotationProvider}>
				<AnnotationManagerProvider
					annotationManager={annotationProvider.annotationManager}
					updateSubscriber={annotationProvider?.inlineComment?.updateSubscriber ?? undefined}
				>
					<AnnotationsWrapperInner
						rendererRef={rendererRef}
						adfDocument={adfDocument}
						isNestedRender={isNestedRender}
						onLoadComplete={onLoadComplete}
					>
						{children}
					</AnnotationsWrapperInner>
				</AnnotationManagerProvider>
			</ProvidersContext.Provider>
		);
	} else {
		return (
			<ProvidersContext.Provider value={annotationProvider}>
				<AnnotationsWrapperInner
					rendererRef={rendererRef}
					adfDocument={adfDocument}
					isNestedRender={isNestedRender}
					onLoadComplete={onLoadComplete}
				>
					{children}
				</AnnotationsWrapperInner>
			</ProvidersContext.Provider>
		);
	}
};
