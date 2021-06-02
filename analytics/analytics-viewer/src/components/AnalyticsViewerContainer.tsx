import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import styled from 'styled-components';
import { AnalyticsViewer, EventsArray } from './AnalyticsViewer';

type Props = {
  children: React.ReactNode;
  channel?: string;
};

type State = {
  events: EventsArray;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChildrenWrapper = styled.div`
  flex-grow: 1;
`;

const StyledAnalyticsViewer = styled(AnalyticsViewer)`
  flex-grow: 0;
  flex-shrink: 1;
  height: 100px;
  overflow-y: scroll;
`;

export class AnalyticsViewerContainer extends React.Component<Props, State> {
  static defaultProps = {
    channel: '*',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  handleOnEvent = (event: UIAnalyticsEvent, channel?: string) => {
    this.setState((state) => ({
      events: [{ event, channel }, ...state.events],
    }));
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.handleOnEvent}
        channel={this.props.channel}
      >
        <Container>
          <ChildrenWrapper>{this.props.children}</ChildrenWrapper>
          <StyledAnalyticsViewer events={this.state.events} />
        </Container>
      </AnalyticsListener>
    );
  }
}
