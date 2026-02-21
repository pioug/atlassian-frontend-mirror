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
import { EditorContext } from '@atlaskit/editor-common/UNSAFE_do_not_use_editor_context';
import { analyticsEventKey } from '@atlaskit/editor-common/utils/analytics';
import { deprecatedOpenHelpCommand } from '@atlaskit/editor-plugins/help-dialog';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type EditorActions from '../../actions';

interface WithHelpTriggerProps {
	render: (openHelp: () => void) => React.ReactNode;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class WithHelpTriggerOld extends React.Component<WithHelpTriggerProps> {
	static contextTypes = {
		editorActions: PropTypes.object.isRequired,
	};

	context!: { editorActions: EditorActions };

	openHelp = () => {
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

	render() {
		return this.props.render(this.openHelp);
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class WithHelpTriggerNew extends React.Component<WithHelpTriggerProps> {
	static contextType = EditorContext;

	context!: { editorActions: EditorActions };

	openHelp = () => {
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

	render() {
		return this.props.render(this.openHelp);
	}
}

export const WithHelpTrigger = (props: WithHelpTriggerProps) =>
	expValEquals('platform_editor_context_context_types_migration', 'isEnabled', true) ? (
		<WithHelpTriggerNew render={props.render} />
	) : (
		<WithHelpTriggerOld render={props.render} />
	);

export default WithHelpTrigger;
