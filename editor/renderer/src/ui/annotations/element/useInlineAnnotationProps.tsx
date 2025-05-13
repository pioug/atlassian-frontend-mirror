import { useContext } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';

import { AnnotationsDraftContext } from '../context';
import { useAnnotationRangeState } from '../contexts/AnnotationRangeContext';

export type MarkDataAttributes = {
	dataAttributes?: {
		'data-renderer-start-pos': number;
	};
};

export function useInlineAnnotationProps(props: MarkDataAttributes) {
	const draftPositionOld = useContext(AnnotationsDraftContext);
	const { selectionDraftDocumentPosition } = useAnnotationRangeState();
	const draftPosition = fg('platform_renderer_annotation_draft_position_fix')
		? selectionDraftDocumentPosition
		: draftPositionOld;

	if (!fg('editor_inline_comments_on_inline_nodes')) {
		return {};
	}

	if (!props.dataAttributes) {
		// the inlineCard component is currently used by the block card, embed card and card error boundary components
		// when used via these components, no dataAttributes are passed (and we don't want it setup for inline comments)
		return {};
	}

	const inlineCardPosition = props.dataAttributes['data-renderer-start-pos'] - 1;

	const hasDraft =
		draftPosition &&
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		draftPosition?.from <= inlineCardPosition! &&
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		draftPosition?.to >= inlineCardPosition! + 1;

	if (hasDraft) {
		return {
			'data-renderer-mark': true,
			'data-annotation-draft-mark': true,
			'data-annotation-inline-node': true,
			'data-renderer-start-pos': inlineCardPosition,
		};
	}
	return {
		'data-annotation-inline-node': true,
		'data-annotation-mark': true,
		'data-renderer-start-pos': inlineCardPosition,
	};
}
