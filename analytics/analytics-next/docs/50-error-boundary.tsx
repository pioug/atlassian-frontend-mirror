import React from 'react';

import { code, md, Props } from '@atlaskit/docs';

export default md`
  ${code`import { AnalyticsErrorBoundary } from '@atlaskit/analytics-next';`}

  Wrap part of your tree in \`AnalyticsErrorBoundary\` to provide error boundary track to any events created beneath it.

  When a component is created verifies all of the components above it in the tree and any error will be catched and tracked automatically.

  It's up to the developer pass this information when you're adding the component.

  Usage:

${code`
import {
  AnalyticsListener,
  AnalyticsErrorBoundary
} from '@atlaskit/analytics-next';

// Wrapping your component with the component
class ButtonWithAnalyticsErrorBoundary extends React.Component {
  handleEvent = (analyticsEvent) => {
    const { payload, context } = analyticsEvent;
    console.log('Received event:', analyticsEvent, { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <AnalyticsErrorBoundary
          channel="atlaskit"
          data={{
            componentName: 'button',
            packageName: '@atlaskit/button',
            componentVersion: '999.9.9',
          }}
        >
          <Button>Click me</Button>
        </AnalyticsErrorBoundary>
      </AnalyticsListener>
    )
  }
}
`}

  ${(
    <Props
      heading="AnalyticsErrorBoundary Props"
      props={require('!!extract-react-types-loader!../src/components/AnalyticsErrorBoundary')}
    />
  )}
`;
