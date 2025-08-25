import React, { useContext } from 'react';
import { useUserSelectionRange } from '../hooks/user-selection';
import { SelectionInlineCommentMounter } from './mounter';
import type { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common/types';
import { RendererContext as ActionsContext } from '../../RendererActionsContext';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

type Props = {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	rendererRef: React.RefObject<HTMLDivElement>;
	selectionComponent: React.ComponentType<
		React.PropsWithChildren<InlineCommentSelectionComponentProps>
	>;
};

export const SelectionRangeValidator = (props: Props) => {
	const { selectionComponent, rendererRef, createAnalyticsEvent } = props;
	const actions = useContext(ActionsContext);
	const [type, range, draftRange, clearRange] = useUserSelectionRange({
		rendererRef,
	});

	const selectionRange = type === 'selection' ? range : null;

	// !!! the draft range will become invalid after the mark DOM is inserted
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
			generateIndexMatch={actions.generateAnnotationIndexMatch.bind(actions)}
			createAnalyticsEvent={createAnalyticsEvent}
		/>
	);
};

SelectionRangeValidator.displayName = 'SelectionRangeValidator';
