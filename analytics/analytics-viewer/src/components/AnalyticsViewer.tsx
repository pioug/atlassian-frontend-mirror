import React from 'react';
import styled from 'styled-components';
import { Event, EventViewer } from './EventViewer';

export type EventsArray = Event[];

type Props = {
  events: EventsArray;
  className?: string;
};

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
  <AnalyticsViewerWrapper className={className}>
    {events.map(renderEventViewer)}
  </AnalyticsViewerWrapper>
);
