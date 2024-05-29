import React from 'react';
import styled from 'styled-components';
import { type Event, EventViewer } from './EventViewer';

export type EventsArray = Event[];

type Props = {
  events: EventsArray;
  className?: string;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const AnalyticsViewerWrapper = styled.ul`
  list-style: none;
  padding: 0;
  & li:nth-child(even) {
    background-color: #fff;
  }
  & li:nth-child(odd) {
    background-color: #eee;
  }
`;

const renderEventViewer = (
  event: Event,
  index: number,
  events: EventsArray,
) => <EventViewer key={events.length - index} {...event} />;

export const AnalyticsViewer = ({ events, className }: Props) => (
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
  <AnalyticsViewerWrapper className={className}>
    {events.map(renderEventViewer)}
  </AnalyticsViewerWrapper>
);
