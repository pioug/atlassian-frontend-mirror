import React from 'react';
import PropTypes from 'prop-types';
import type { AnalyticsDispatch } from '../../plugins/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../plugins/analytics';
import { createDispatch } from '../../event-dispatcher';
import { analyticsEventKey } from '../../plugins/analytics/consts';
// TODO - ED-20189 Source deprecatedOpenHelpCommand from help-dialog-plugin
import { openHelpCommand } from '../../plugins/help-dialog/commands';

interface WithHelpTriggerProps {
  render: (openHelp: () => void) => React.ReactNode;
}

/**
 * @deprecated
 * Use WithHelpTrigger from @atlaskit/editor-plugin-help-dialog which uses pluginInjectionApi
 */
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
      openHelpCommand(editorView.state.tr, editorView.dispatch);
    }
  };

  render() {
    return this.props.render(this.openHelp);
  }
}
