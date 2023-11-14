import React from 'react';
import PropTypes from 'prop-types';
import type { AnalyticsDispatch } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import { createDispatch } from '../../event-dispatcher';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import { deprecatedOpenHelpCommand } from '@atlaskit/editor-plugin-help-dialog';

interface WithHelpTriggerProps {
  render: (openHelp: () => void) => React.ReactNode;
}

export default class WithHelpTrigger extends React.Component<
  WithHelpTriggerProps,
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
      deprecatedOpenHelpCommand(editorView.state.tr, editorView.dispatch);
    }
  };

  render() {
    return this.props.render(this.openHelp);
  }
}
