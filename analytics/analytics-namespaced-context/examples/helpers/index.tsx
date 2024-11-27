import {
	createAndFireEvent,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import React from 'react';
import { token } from '@atlaskit/tokens';

export type Props = WithAnalyticsEventsProps & {
	text?: string;
	onClick: (e: React.SyntheticEvent) => void;
};

class DummyComponent extends React.Component<Props> {
	render() {
		const { onClick, text } = this.props;
		return (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
			<div
				id="dummy"
				onClick={onClick}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ paddingBottom: token('space.150', '12px') }}
			>
				<button>{text || 'Test'}</button>
			</div>
		);
	}
}

export const createDummyComponentWithAnalytics = (channel?: string) =>
	withAnalyticsEvents({
		onClick: createAndFireEvent(channel)({
			action: 'someAction',
			actionSubject: 'someComponent',
			eventType: 'ui',
			attributes: {
				packageVersion: '1.0.0',
				packageName: '@atlaskit/foo',
				componentName: 'foo',
				foo: 'bar',
			},
		}),
	})(DummyComponent);
