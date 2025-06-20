import React from 'react';

import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import Heading from '@atlaskit/heading';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, xcss } from '@atlaskit/primitives';

import { Card } from '../../src';
import { ResolvedClient, ResolvedClientUrl } from '../utils/custom-client';

const headingBoxStyles = xcss({
	marginBottom: 'space.100',
});

const stackBoxStyles = xcss({
	marginTop: 'space.100',
});

type ExampleComponentProps = {
	setRecentEvents: React.Dispatch<React.SetStateAction<any>>;
	showHoverPreview: boolean;
};

const ExampleComponent = ({
	setRecentEvents,
	showHoverPreview,
}: ExampleComponentProps): JSX.Element => {
	const mockAnalyticsClient = React.useMemo(() => {
		return {
			sendUIEvent: (event) => {
				console.log('ui event', event);
				setRecentEvents(event);
			},
			sendOperationalEvent: (event) => console.log('operational event', event),
			sendTrackEvent: (event) => console.log('track event', event),
			sendScreenEvent: (event) => console.log('screen event', event),
		} satisfies AnalyticsWebClient;
	}, [setRecentEvents]);

	const handleOnClick = React.useCallback(
		(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
			e.preventDefault();
			return;
		},
		[],
	);

	return (
		<FabricAnalyticsListeners client={mockAnalyticsClient}>
			<AnalyticsContext
				data={{
					source: 'content',
					attributes: {
						displayCategory: 'link',
						display: 'url',
						id: '123',
					},
				}}
			>
				<SmartCardProvider client={new ResolvedClient('dev')}>
					<Card
						url={ResolvedClientUrl}
						appearance="inline"
						platform="web"
						showHoverPreview={showHoverPreview}
						onClick={handleOnClick}
					/>
				</SmartCardProvider>
			</AnalyticsContext>
		</FabricAnalyticsListeners>
	);
};

export default () => {
	const [recentEvents, setRecentEvents] = React.useState<any>({});
	const [showHoverPreview, setShowHoverPreview] = React.useState(false);

	return (
		<Box>
			<Box xcss={headingBoxStyles}>
				<Heading size="medium">Interact with the link below and see events being fired</Heading>
			</Box>
			<Box xcss={stackBoxStyles}>
				<label>
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
					<input
						type="checkbox"
						checked={showHoverPreview}
						onChange={(e) => setShowHoverPreview(e.target.checked)}
					/>
					Enable hover card
				</label>
			</Box>

			<ExampleComponent setRecentEvents={setRecentEvents} showHoverPreview={showHoverPreview} />
			<Box xcss={stackBoxStyles}>
				<Heading size="small">Most recent ui event fired</Heading>
				<pre>{JSON.stringify(recentEvents, null, 2)}</pre>
			</Box>
		</Box>
	);
};
