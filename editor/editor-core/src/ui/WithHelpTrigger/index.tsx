import React from 'react';

import PropTypes from 'prop-types';

import type { AnalyticsDispatch } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import { analyticsEventKey } from '@atlaskit/editor-common/utils/analytics';
import { deprecatedOpenHelpCommand } from '@atlaskit/editor-plugins/help-dialog';

import type EditorActions from '../../actions';

interface WithHelpTriggerProps {
	render: (openHelp: () => void) => React.ReactNode;
}

export default class WithHelpTrigger extends React.Component<WithHelpTriggerProps> {
	static contextTypes = {
		editorActions: PropTypes.object.isRequired,
	};
	context!: { editorActions: EditorActions };

	openHelp = () => {
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

	render() {
		return this.props.render(this.openHelp);
	}
}
