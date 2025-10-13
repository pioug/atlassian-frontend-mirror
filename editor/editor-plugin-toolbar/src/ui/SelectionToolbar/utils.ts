import {
	ACTION,
	ACTION_SUBJECT,
	CONTENT_COMPONENT,
	EVENT_TYPE,
	type AnalyticsEventPayload,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const getDomRefFromSelection = (
	view: EditorView,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
	try {
		const domRef = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));

		if (domRef instanceof HTMLElement) {
			return domRef;
		}

		throw new Error('Invalid DOM reference');
	} catch (error: unknown) {
		if (dispatchAnalyticsEvent) {
			const payload: AnalyticsEventPayload = {
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					component: CONTENT_COMPONENT.SELECTION_TOOLBAR,
					selection: view.state.selection.toJSON(),
					position: view.state.selection.from,
					docSize: view.state.doc.nodeSize,
					error: error instanceof Error ? error.toString() : String(error),
					// @ts-expect-error - Object literal may only specify known properties, 'errorStack' does not exist in type
					// This error was introduced after upgrading to TypeScript 5
					errorStack: error instanceof Error ? error.stack : undefined,
				},
			};
			dispatchAnalyticsEvent(payload);
		}

		if (error instanceof Error) {
			logException(error, { location: 'editor-plugin-toolbar/selectionToolbar' });
		}
	}
};
