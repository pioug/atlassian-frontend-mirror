import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import React from 'react';
import { createDummyComponentWithAnalytics } from './helpers';
import { NavigationAnalyticsContext } from '../src/NavigationAnalyticsContext';

const myOnClickHandler = () => {};

const listenerHandler = (event: UIAnalyticsEvent, channel?: string) => {
	console.log('listenerHandler, event: ', event, ' channel: ', channel);
};

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(FabricChannel.navigation);

export default function Example(): React.JSX.Element {
	return (
		<AnalyticsListener onEvent={listenerHandler} channel={FabricChannel.navigation}>
			<div>
				<NavigationAnalyticsContext data={{ greeting: 'hello' }}>
					<ElementsComponentWithAnalytics onClick={myOnClickHandler} />
				</NavigationAnalyticsContext>
			</div>
		</AnalyticsListener>
	);
}
