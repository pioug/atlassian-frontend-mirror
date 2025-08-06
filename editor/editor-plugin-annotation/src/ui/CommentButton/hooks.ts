import { useEffect } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getRangeInlineNodeNames } from '@atlaskit/editor-common/utils';
import { type EditorState, type SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { AnnotationPlugin } from '../../annotationPluginType';
import { resolveDraftBookmark } from '../../pm-plugins/utils';
import type { AnnotationSelectionType } from '../../types';
import { type AnnotationProviders } from '../../types';

import { fireCommentButtonViewedAnalyticsEvent } from './utils';

export const useCommentButtonMount = ({
	state,
	annotationProviders,
	api,
	annotationSelectionType,
	bookmark,
}: {
	state: EditorState | null;
	annotationProviders?: AnnotationProviders;
	api?: ExtractInjectionAPI<AnnotationPlugin>;
	annotationSelectionType: AnnotationSelectionType;
	bookmark?: SelectionBookmark;
}) => {
	useEffect(() => {
		if (!state) {
			return;
		}

		if (
			annotationProviders?.inlineComment &&
			fg('confluence_frontend_preload_inline_comment_editor')
		) {
			annotationProviders.inlineComment.onCommentButtonMount?.();
		}
		// Check if the selection includes an non-text inline node
		const inlineNodeNames =
			getRangeInlineNodeNames({
				doc: state.doc,
				pos: resolveDraftBookmark(state, bookmark),
			}) ?? [];

		const isNonTextInlineNodeInludedInComment =
			inlineNodeNames.filter((nodeName) => nodeName !== 'text').length > 0;

		fireCommentButtonViewedAnalyticsEvent({
			api,
			isNonTextInlineNodeInludedInComment,
			annotationSelectionType,
		});
		// for now trying to replicate current onMount logic
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
