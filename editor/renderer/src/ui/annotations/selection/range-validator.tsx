import React, { useContext } from 'react';
import type { Position } from '../types';
import { useUserSelectionRange } from '../hooks/user-selection';
import { SelectionInlineCommentMounter } from './mounter';
import type { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common/types';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

type Props = {
	selectionComponent: React.ComponentType<
		React.PropsWithChildren<InlineCommentSelectionComponentProps>
	>;
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

export const SelectionRangeValidator = (props: Props) => {
	const {
		selectionComponent,
		rendererRef,
		applyAnnotationDraftAt,
		clearAnnotationDraft,
		createAnalyticsEvent,
	} = props;
	const actions = useContext(ActionsContext);
	const [type, range, draftRange, clearRange] = useUserSelectionRange({
		rendererRef,
	});

	const selectionRange = type === 'selection' ? range : null;

	if (!selectionRange && !draftRange) {
		return null;
	}
	const documentPosition = actions.getPositionFromRange(range);

	// This property is drilled down to consumers when a new range is selected to test it's validity
	let isAnnotationAllowedOnRange = false;
	try {
		isAnnotationAllowedOnRange =
			documentPosition && actions.isValidAnnotationPosition(documentPosition);
	} catch {
		isAnnotationAllowedOnRange = false;
	}

	return (
		<SelectionInlineCommentMounter
			range={selectionRange}
			draftRange={draftRange}
			wrapperDOM={rendererRef}
			component={selectionComponent}
			onClose={clearRange}
			documentPosition={documentPosition}
			isAnnotationAllowed={isAnnotationAllowedOnRange}
			applyAnnotation={actions.applyAnnotation.bind(actions)}
			applyAnnotationDraftAt={applyAnnotationDraftAt}
			generateIndexMatch={actions.generateAnnotationIndexMatch.bind(actions)}
			clearAnnotationDraft={clearAnnotationDraft}
			createAnalyticsEvent={createAnalyticsEvent}
		/>
	);
};

SelectionRangeValidator.displayName = 'SelectionRangeValidator';
