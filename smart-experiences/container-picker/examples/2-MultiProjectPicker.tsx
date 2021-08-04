import React from 'react';
import { setEnv, ProjectPicker } from '../src/index';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

setEnv('local');

export default class MultiProjectPicker extends React.Component {
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
          cloudId="49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5"
          contextType="jiraProjectPicker"
          isMulti={true}
        />
      </AnalyticsListener>
    );
  }
}
