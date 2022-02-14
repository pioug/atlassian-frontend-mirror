import React, { useCallback, useState } from 'react';
import { ProjectPicker } from '../src/index';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { useEndpointMocks } from './utils/mock-requests';

export const PickerExample: React.FC = () => {
  const [isMulti, setIsMulti] = useState(false);
  useEndpointMocks();

  const onEvent = useCallback((e: UIAnalyticsEvent) => {
    console.log(
      `Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,
      e.payload,
    );
  }, []);

  const onToggle = useCallback(() => {
    setIsMulti((oldIsMulti) => !oldIsMulti);
  }, []);

  return (
    <>
      <p>
        <label>
          <input type="checkbox" onChange={onToggle} /> Multiple selection
        </label>
      </p>
      <AnalyticsListener onEvent={onEvent} channel="fabric-elements">
        <ProjectPicker
          cloudId="fake-cloud-id"
          contextType="jiraProjectPicker"
          isMulti={isMulti}
        />
      </AnalyticsListener>
    </>
  );
};

export default PickerExample;
