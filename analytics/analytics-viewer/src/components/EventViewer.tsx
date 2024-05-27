import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import styled from 'styled-components';
import { PropertyViewer } from './PropertyViewer';

export type Event = {
  channel?: string;
  event: UIAnalyticsEvent;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const EventViewerWrapper = styled.li`
  font-size: 12px;
  padding: 3px;

  & span:first-child {
    margin-left: 0;
  }
  & span:last-child {
    margin-left: 5px;
  }
`;

export class EventViewer extends React.PureComponent<
  Event,
  { showMore: boolean }
> {
  constructor(props: Event) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  private handleMoreClick = () => {
    this.setState((state) => ({
      showMore: !state.showMore,
    }));
  };

  render() {
    const { event } = this.props;
    return (
      <EventViewerWrapper>
        <PropertyViewer object={this.props} property="channel" />
        <PropertyViewer object={event.payload} property="action" />
        <PropertyViewer object={event.payload} property="actionSubject" />
        <PropertyViewer object={event.payload} property="actionSubjectId" />
        <PropertyViewer object={event.payload} property="type" />
        {this.state.showMore &&
          Object.keys(event.payload.attributes).map((attribute) => (
            <PropertyViewer
              key={attribute}
              object={event.payload.attributes}
              property={attribute}
            />
          ))}
        <span>
          <a onClick={this.handleMoreClick}>
            {this.state.showMore ? 'less' : 'more'}...
          </a>
        </span>
      </EventViewerWrapper>
    );
  }
}
