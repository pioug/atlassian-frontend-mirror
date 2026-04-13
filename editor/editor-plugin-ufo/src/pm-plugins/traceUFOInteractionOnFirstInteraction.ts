import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { atTheBeginningOfDoc } from '@atlaskit/editor-common/selection';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { abortAll, getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';

export const traceUFOInteractionOnFirstInteraction = (): SafePlugin => {
	return new SafePlugin({
		view() {
			let aborted = false;
			return {
				update(view: EditorView, prevState: EditorState) {
					if (aborted) {
						// opt out of additional logic if already aborted
						return;
					}

					if (
						!view.state.selection.eq(prevState.selection) &&
						!atTheBeginningOfDoc(view.state) &&
						!isEmptyDocument(view.state.doc)
					) {
						const activeInteraction = getActiveInteraction();

						if (
							activeInteraction &&
							['edit-page', 'live-edit'].includes(activeInteraction.ufoName)
						) {
							abortAll('new_interaction', `selection-changed-on-editor-element`);
						}
						aborted = true;
					}
				},
			};
		},
	});
};
