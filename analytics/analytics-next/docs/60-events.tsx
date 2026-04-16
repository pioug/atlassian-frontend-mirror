/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading -- Legacy analytics-next docs intentionally use plain HTML prose instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock } from './DocBlocks';

const uiAnalyticsEventCode = `
/** An array of objects containing data provided by any AnalyticsContext
 * components in the tree above where this event was created. */
context: Array<{}>;

/** An array of functions provided by any AnalyticsListener components in the
 * tree above where this event was created. */
handlers: Array<(event: UIAnalyticsEvent, channel?: string) => void>;

/** An object containing an action field and other arbitrary data. Can be
 * modified via the .update() method. */
payload: {
  action: string,
  [string]: any
};

/** Create a new event with the same context, handlers and payload as this
 * event. */
clone(): UIAnalyticsEvent | null;

/** Fire this event on the given channel. Listeners on this channel will be
 * called. */
fire(channel?: string): void;

/** Modify this event's payload. Accepts either a function, which will be passed
 * the current payload and must return a new payload, or an object, which will
 * be shallow merged into the current payload. */
update(
  updater: | { [string]: any }
  | ((payload: { action: string, [string]: any }) => {
      action: string,
      [string]: any,
    }),
) => UIAnalyticsEvent;
`;

export default function EventsDocs(): React.JSX.Element {
	return (
		<div>
			<h3 id="UIAnalyticsEvent">UIAnalyticsEvent</h3>
			<p>
				The class can be used to represent an analytics event triggered by a user interaction. It
				has the following interface:
			</p>
			<CodeBlock code={uiAnalyticsEventCode} />
			<h3 id="AnalyticsEvent">AnalyticsEvent</h3>
			<CodeBlock code={`import { AnalyticsEvent } from '@atlaskit/analytics-next';`} />
			<p>
				A more generic type of event which only contains a payload and an update method. If you want
				to create an event outside of the UI you can create an instance of this class directly.
			</p>
			<p>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor -- This legacy docs page keeps plain hash links for local section navigation. */}
				Please see <a href="#UIAnalyticsEvent">UIAnalyticsEvent</a> for more information.
			</p>
		</div>
	);
}
