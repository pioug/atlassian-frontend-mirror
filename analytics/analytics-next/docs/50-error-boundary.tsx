/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading -- Legacy analytics-next docs intentionally use plain HTML prose instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock, PropsBlock } from './DocBlocks';

const usageCode = `
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
`;

export default function ErrorBoundaryDocs(): React.JSX.Element {
	return (
		<div>
			<CodeBlock code={`import { AnalyticsErrorBoundary } from '@atlaskit/analytics-next';`} />
			<p>
				Wrap part of your tree in <code>AnalyticsErrorBoundary</code> to provide error boundary
				track to any events created beneath it.
			</p>
			<p>
				When a component is created verifies all of the components above it in the tree and any
				error will be catched and tracked automatically.
			</p>
			<p>
				It&apos;s up to the developer pass this information when you&apos;re adding the component.
			</p>
			<h4>Usage</h4>
			<CodeBlock code={usageCode} />
			<PropsBlock
				heading="AnalyticsErrorBoundary Props"
				props={require('!!extract-react-types-loader!../src/components/AnalyticsErrorBoundary')}
			/>
		</div>
	);
}
