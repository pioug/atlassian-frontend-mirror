import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import React from 'react';
import { createDummyComponentWithAnalytics } from './helpers';
import { FabricElementsAnalyticsContext } from '../src/FabricElementsAnalyticsContext';

const myOnClickHandler = () => {};

const listenerHandler = (event: UIAnalyticsEvent, channel?: string) => {
	console.log('listenerHandler, event: ', event, ' channel: ', channel);
};

const ElementsComponentWithAnalytics = createDummyComponentWithAnalytics(FabricChannel.elements);

export default function Example(): React.JSX.Element {
	return (
		<AnalyticsListener onEvent={listenerHandler} channel={FabricChannel.elements}>
			<div>
				<FabricElementsAnalyticsContext data={{ greeting: 'hello' }}>
					<ElementsComponentWithAnalytics onClick={myOnClickHandler} />
				</FabricElementsAnalyticsContext>
			</div>
		</AnalyticsListener>
	);
}
