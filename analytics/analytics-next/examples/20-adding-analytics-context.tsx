import React, { useCallback } from 'react';

import Button from '@atlaskit/button/standard-button';

import { AnalyticsContext, AnalyticsListener, UIAnalyticsEvent } from '../src';

const SaveButton = () => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
      analyticsEvent.fire();
    },
    [],
  );

  return (
    <Button appearance="primary" onClick={onClick}>
      Save
    </Button>
  );
};

const App = () => {
  const onEvent = ({ context }: UIAnalyticsEvent) =>
    console.log('Event context:', context);

  return (
    <AnalyticsListener onEvent={onEvent}>
      <AnalyticsContext data={{ issueId: 123 }}>
        <AnalyticsContext data={{ panel: 'right' }}>
          <SaveButton />
        </AnalyticsContext>
      </AnalyticsContext>
    </AnalyticsListener>
  );
};

export default App;
