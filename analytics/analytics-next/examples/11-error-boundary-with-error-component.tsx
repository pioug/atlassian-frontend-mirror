import React, { useEffect } from 'react';

import { AnalyticsErrorBoundary } from '../src';

const ComponentWithError = () => {
  useEffect(() => {
    throw new Error('a test error');
  });

  return null;
};

const onError = () => {
  console.log('An error was caught.');
};

const ErrorScreen = () => {
  return (
    <>
      <h1>You dun goofed</h1>
      <div>
        This is a custom error screen. An unexpected error has occurred.
      </div>
    </>
  );
};

export default () => {
  return (
    <AnalyticsErrorBoundary
      channel="atlaskit"
      data={{
        componentName: 'button',
        packageName: '@atlaskit/button/standard-button',
        componentVersion: '999.9.9',
      }}
      ErrorComponent={ErrorScreen}
      onError={onError}
    >
      <>
        <div>
          You won't see this because an error would have occurred by now.
        </div>
        <ComponentWithError />
      </>
    </AnalyticsErrorBoundary>
  );
};
