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

export default () => {
  return (
    <AnalyticsErrorBoundary
      channel="atlaskit"
      data={{
        componentName: 'button',
        packageName: '@atlaskit/button/standard-button',
        componentVersion: '999.9.9',
      }}
      onError={onError}
    >
      <>
        <div>
          You still see this message even though an unhandled error occurred in
          a sibling component. You may see lots of errors in the console because
          the component with error continually tries to render even though there
          is an error.
        </div>
        <ComponentWithError />
      </>
    </AnalyticsErrorBoundary>
  );
};
