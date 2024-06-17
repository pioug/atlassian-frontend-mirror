import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import { type Event, EventViewer } from './EventViewer';

export type EventsArray = Event[];

type Props = {
	events: EventsArray;
	className?: string;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const AnalyticsViewerWrapper = styled.ul({
	listStyle: 'none',
	padding: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& li:nth-child(even)': {
		backgroundColor: '#fff',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& li:nth-child(odd)': {
		backgroundColor: '#eee',
	},
});

const renderEventViewer = (event: Event, index: number, events: EventsArray) => (
	<EventViewer key={events.length - index} {...event} />
);

export const AnalyticsViewer = ({ events, className }: Props) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	<AnalyticsViewerWrapper className={className}>
		{events.map(renderEventViewer)}
	</AnalyticsViewerWrapper>
);
