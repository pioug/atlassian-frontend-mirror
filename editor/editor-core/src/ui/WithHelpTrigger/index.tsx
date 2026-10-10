import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics/types/enums';
import type { AnalyticsDispatch } from '@atlaskit/editor-common/analytics/types/events';
import { createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';
import { analyticsEventKey } from '@atlaskit/editor-common/utils/analytics';
import { deprecatedOpenHelpCommand } from '@atlaskit/editor-plugins/help-dialog';

import type EditorActions from '../../actions';

interface WithHelpTriggerProps {
	render: (openHelp: () => void) => React.ReactNode;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class WithHelpTrigger extends React.Component<WithHelpTriggerProps> {
	static contextType: React.Context<Record<string, unknown>> = EditorContext;

	context!: { editorActions: EditorActions };

	openHelp = (): void => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const { editorActions } = this.context!;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dispatch: AnalyticsDispatch = createDispatch((editorActions as any).eventDispatcher);
		dispatch(analyticsEventKey, {
			payload: {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BUTTON,
				actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
				attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
				eventType: EVENT_TYPE.UI,
			},
		});

		const editorView = editorActions._privateGetEditorView();
		if (editorView) {
			deprecatedOpenHelpCommand(editorView.state.tr, editorView.dispatch);
		}
	};

	render(): React.ReactNode {
		return this.props.render(this.openHelp);
	}
}

export default WithHelpTrigger;
