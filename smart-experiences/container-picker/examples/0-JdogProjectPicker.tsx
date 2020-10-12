import React from 'react';
import { setEnv, ProjectPicker } from '../src/index';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

setEnv('local');

export default class JdogProjectPicker extends React.Component {
  onEvent = (e: UIAnalyticsEvent) => {
    console.log(
      `Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
      e.payload,
    );
  };

  render() {
    return (
      <AnalyticsListener onEvent={this.onEvent} channel="fabric-elements">
        <ProjectPicker
          cloudId="497ea592-beb4-43c3-9137-a6e5fa301088"
          contextType="jiraProjectPicker"
        />
      </AnalyticsListener>
    );
  }
}
