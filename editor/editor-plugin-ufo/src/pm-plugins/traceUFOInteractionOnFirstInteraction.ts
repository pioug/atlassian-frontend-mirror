/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';

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
					// This Plugin is not currently used as it leads to too high a level of abortions (due to the current TTAI timing being long, and users starting click before TTAI completes).
					// This can be reconsidered if we meaningfully reduce our TTAI (ie. <7 seconds)
					// If we did want to re-enable it, we would want to rollout with the ability to gate to specific events like below:
					// if (expValEquals('cc_editor_interactions_trigger_traceufointeraction', 'cohort', 'only_mousedown_event')) { return }
					abortIfNotAborted(event);
				},
				mouseenter: (_view: EditorView, event: Event) => {
					// This Plugin is not currently used as it leads to too high a level of abortions (due to the current TTAI timing being long, and users starting click before TTAI completes).
					// This can be reconsidered if we meaningfully reduce our TTAI (ie. <7 seconds)
					// If we did want to re-enable it, we would want to rollout with the ability to gate to specific events like below:
					// if (expValEquals('cc_editor_interactions_trigger_traceufointeraction', 'cohort', 'only_mousedown_event')) { return }

					abortIfNotAborted(event);
				},
				mousedown: (_view: EditorView, event: Event) => abortIfNotAborted(event),
			},
		},
	});
};
