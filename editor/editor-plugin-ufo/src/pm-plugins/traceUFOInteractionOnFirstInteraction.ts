/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const traceUFOInteractionOnFirstInteraction = () => {
	let aborted = false;

	function abortIfNotAborted(event: Event) {
		if (aborted) {
			// opt out of additional logic if already aborted
			return;
		}

		const activeInteraction = getActiveInteraction();

		if (activeInteraction && ['edit-page', 'live-edit'].includes(activeInteraction.ufoName)) {
			traceUFOInteraction('new_interaction', event);
		}

		aborted = true;
	}

	return new SafePlugin({
		props: {
			handleDOMEvents: {
				mouseover: (_view: EditorView, event: Event) => {
					if (
						expValEquals(
							'cc_editor_interactions_trigger_traceufointeraction',
							'cohort',
							'only_mousedown_event',
						)
					) {
						return;
					}

					abortIfNotAborted(event);
				},
				mouseenter: (_view: EditorView, event: Event) => {
					if (
						expValEquals(
							'cc_editor_interactions_trigger_traceufointeraction',
							'cohort',
							'only_mousedown_event',
						)
					) {
						return;
					}

					abortIfNotAborted(event);
				},
				mousedown: (_view: EditorView, event: Event) => abortIfNotAborted(event),
			},
		},
	});
};
