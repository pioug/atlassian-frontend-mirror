import React from 'react';
import PropTypes from 'prop-types';
import {
  AnalyticsDispatch,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../plugins/analytics';
import { createDispatch } from '../../event-dispatcher';
import { openHelpCommand } from '../../plugins/help-dialog/commands';
import { analyticsEventKey } from '../../plugins/analytics/consts';

export default class WithHelpTrigger extends React.Component<
  { render: (openHelp: () => void) => React.ReactNode },
  any
> {
  static contextTypes = {
    editorActions: PropTypes.object.isRequired,
  };

  openHelp = () => {
    const { editorActions } = this.context;

    const dispatch: AnalyticsDispatch = createDispatch(
      editorActions.eventDispatcher,
    );
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
      openHelpCommand(editorView.state.tr, editorView.dispatch);
    }
  };

  render() {
    return this.props.render(this.openHelp);
  }
}
