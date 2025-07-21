import React from 'react';

import {
	AnalyticsContext,
	AnalyticsListener,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Heading from '@atlaskit/heading';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Text, xcss } from '@atlaskit/primitives';

import { Card } from '../../src';

const headingBoxStyles = xcss({
	marginBottom: 'space.100',
});

const stackBoxStyles = xcss({
	marginTop: 'space.100',
});

type ExampleComponentProps = {
	setRecentEvents: React.Dispatch<React.SetStateAction<UIAnalyticsEvent[]>>;
};

const ExampleComponent = ({ setRecentEvents }: ExampleComponentProps): JSX.Element => {
	const handleOnClick = React.useCallback(
		(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
			e.preventDefault();
			return;
		},
		[],
	);

	return (
		<AnalyticsListener
			onEvent={(event) => {
				setRecentEvents((prevEvents) => [...prevEvents, event]);
			}}
			channel="*"
		>
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
						showHoverPreview={true}
						onClick={handleOnClick}
					/>
				</SmartCardProvider>
			</AnalyticsContext>
		</AnalyticsListener>
	);
};

export default () => {
	const [recentEvents, setRecentEvents] = React.useState<UIAnalyticsEvent[]>([]);
	const mostRecent10Events = React.useMemo(() => {
		return Array.from({ length: 10 }, (_, i) => {
			return recentEvents.at(recentEvents.length - i - 1);
		});
	}, [recentEvents]);

	return (
		<Box>
			<Box xcss={headingBoxStyles}>
				<Heading size="medium">Interact with the link below and see events being fired</Heading>
			</Box>
			<ExampleComponent setRecentEvents={setRecentEvents} />
			<Box xcss={stackBoxStyles}>
				<Heading size="small">The 10 Most Recent Events Fired</Heading>
				<ol>
					{mostRecent10Events.map((event, index) => {
						if (event === undefined) {
							return <li key={index}></li>;
						}
						const { action, actionSubject, eventType } = event.payload;
						return (
							<li key={index}>
								<Text
									key={index}
								>{`actionSubject: ${actionSubject}, action: ${action}, eventType: ${eventType}`}</Text>
							</li>
						);
					})}
				</ol>
			</Box>
		</Box>
	);
};
