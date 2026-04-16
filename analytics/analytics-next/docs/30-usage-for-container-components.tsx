/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading, @atlaskit/design-system/no-html-anchor -- Legacy analytics-next docs intentionally use plain HTML prose and links instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock } from './DocBlocks';

const hocCode = `
import { withAnalyticsContext } from '@atlaskit/analytics-next';

const MyContainer = ({children}) => {
  return (
    <div>
      {children}
    </div>
  );
}

const AnalyticsWrappedContainer = withAnalyticsContext({
  issueId: 'ABC-123',
  issueType: 'bug'
})(MyContainer);

export AnalyticsWrappedContainer;
`;

const manualCode = `
import { AnalyticsContext } from '@atlaskit/analytics-next';

export MyContainer = ({children}) => {
  const data = {
    issueId: 'ABC-123',
    issueType: 'bug'
  };

  return (
    <div>
      <AnalyticsContext data={data}>
        {children}
      </AnalyticsContext>
    </div>
  );
`;

export default function UsageForContainerComponents(): React.JSX.Element {
	return (
		<div>
			<p>
				This guide describes how to set up analytics for a React component that is a container for
				children that fire analytics events, and where you wish to include contextual information to
				those children about where it is embeded in the event fired.
			</p>
			<p>
				For example, you might fire an event on a button click, but want to distinguish whether it
				was from inside a form or on the navigation panel.
			</p>
			<p>
				Analytics Contexts are the way this is achieved in <code>@atlaskit/analytics-next</code>.
			</p>
			<p>
				For a conceptual overview of <code>@atlaskit/analytics-next</code>, please consult the{' '}
				<a href="./concepts">concepts page</a>.
			</p>
			<p>Container components can pass this context in two key ways:</p>
			<h4>
				1) Using the <code>withAnalyticsContext</code> higher order component (Recommended)
			</h4>
			<CodeBlock code={hocCode} />
			<h4>
				2) Use the <code>AnalyticsContext</code> component manually
			</h4>
			<CodeBlock code={manualCode} />
			<h4>Side note</h4>
			<p>
				While it is possible to use the React context from{' '}
				<code>@atlaskit/analytics-next-stable-react-context</code> directly, we encourage you to use
				one of these two approaches instead, as they are optimised to ensure the value provided to
				React Context is a stable reference, and won&apos;t introduce unnecessary re-renders.
			</p>
		</div>
	);
}
