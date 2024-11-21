import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
	type ContentNodeWithPos,
	findParentNodeOfType,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const getMaybeLayoutSection = (state: EditorState): ContentNodeWithPos | undefined => {
	const {
		schema: {
			nodes: { layoutSection, layoutColumn },
		},
		selection,
	} = state;
	const isLayoutColumn =
		editorExperiment('advanced_layouts', true) && findSelectedNodeOfType([layoutColumn])(selection);

	// When selection is on layoutColumn, we want to hide floating toolbar, hence don't return layoutSection node here
	return isLayoutColumn
		? undefined
		: findParentNodeOfType(layoutSection)(selection) ||
				findSelectedNodeOfType([layoutSection])(selection);
};
