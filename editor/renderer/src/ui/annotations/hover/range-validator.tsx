import React, { useContext } from 'react';
import type { Position } from '../types';
import { Mounter } from './mounter';
import type { InlineCommentHoverComponentProps } from '@atlaskit/editor-common/types';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
	useAnnotationRangeDispatch,
	useAnnotationRangeState,
} from '../contexts/AnnotationRangeContext';
import { useAnnotationHoverContext } from '../contexts/AnnotationHoverContext';

type Props = {
	component: React.ComponentType<InlineCommentHoverComponentProps>;
	rendererRef: React.RefObject<HTMLDivElement>;
	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 */
	applyAnnotationDraftAt?: (position: Position) => void;
	/**
	 * @private
	 * @deprecated This prop is deprecated as of platform_renderer_annotation_draft_position_fix and will be removed in the future.
	 */
	clearAnnotationDraft?: () => void;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
};

export const RangeValidator = (props: Props) => {
	const {
		component,
		rendererRef,
		applyAnnotationDraftAt,
		clearAnnotationDraft,
		createAnalyticsEvent,
	} = props;
	const actions = useContext(ActionsContext);
	const { clearHoverRange } = useAnnotationRangeDispatch();
	const { range, type } = useAnnotationRangeState();
	const { isWithinRange } = useAnnotationHoverContext();

	if (!range || type !== 'hover') {
		return null;
	}

	const documentPosition = actions.getPositionFromRange(range);
	return (
		<Mounter
			isWithinRange={isWithinRange}
			range={range}
			wrapperDOM={rendererRef}
			component={component}
			onClose={clearHoverRange}
			documentPosition={documentPosition}
			isAnnotationAllowed={true}
			applyAnnotation={actions.applyAnnotation.bind(actions)}
			applyAnnotationDraftAt={applyAnnotationDraftAt}
			generateIndexMatch={actions.generateAnnotationIndexMatch.bind(actions)}
			clearAnnotationDraft={clearAnnotationDraft}
			createAnalyticsEvent={createAnalyticsEvent}
		/>
	);
};

RangeValidator.displayName = 'HoverRangeValidator';
