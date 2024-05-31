import React, { useContext, useMemo } from 'react';
import { ProvidersContext } from '../context';
import { useAnnotationClickEvent } from '../hooks';
import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { RendererContext } from '../../../ui/RendererActionsContext';
import { type AnnotationTypes } from '@atlaskit/adf-schema';

type Props = {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

type AnnotationInfo = {
	id: string;
	type: AnnotationTypes.INLINE_COMMENT;
};

const AnnotationView = (props: Props) => {
	const providers = useContext(ProvidersContext);
	const actionContext = useContext(RendererContext);
	const inlineCommentProvider = providers && providers.inlineComment;

	const updateSubscriber =
		(inlineCommentProvider && inlineCommentProvider.updateSubscriber) || null;

	const isCommentsOnMediaAnalyticsEnabled =
		inlineCommentProvider?.isCommentsOnMediaAnalyticsEnabled;

	const viewComponentProps = useAnnotationClickEvent({
		updateSubscriber,
		createAnalyticsEvent: props.createAnalyticsEvent,
		isCommentsOnMediaAnalyticsEnabled,
	});

	const ViewComponent = inlineCommentProvider && inlineCommentProvider.viewComponent;

	const deleteAnnotation = useMemo(
		() => (annotationInfo: AnnotationInfo) =>
			actionContext.deleteAnnotation(annotationInfo.id, annotationInfo.type),
		[actionContext],
	);

	if (ViewComponent && viewComponentProps) {
		const { annotations, clickElementTarget } = viewComponentProps;
		return (
			<ViewComponent
				annotations={annotations}
				clickElementTarget={clickElementTarget}
				deleteAnnotation={deleteAnnotation}
			/>
		);
	}

	return null;
};

export { AnnotationView };
