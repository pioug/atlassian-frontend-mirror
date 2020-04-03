import React from 'react';
import { Component } from 'react';
import { TimeRange } from '../src';
import { Container, Group, TimeRangeWrapper } from '../example-helpers/styled';

export interface ExampleState {
  currentTime1: number;
  currentTime2: number;
  currentTime3: number;
}

class Example extends Component<any, ExampleState> {
  state: ExampleState = {
    currentTime1: 20,
    currentTime2: 0,
    currentTime3: 50,
  };

  onChange1 = (currentTime1: number) => {
    this.setState({ currentTime1 });
  };

  onChange2 = (currentTime2: number) => {
    this.setState({ currentTime2 });
  };

  onChange3 = (currentTime3: number) => {
    this.setState({ currentTime3 });
  };

  render() {
    const { currentTime1, currentTime2, currentTime3 } = this.state;

    return (
      <Container>
        <Group>
          <h2>Time range</h2>
          {currentTime1}
          <TimeRangeWrapper>
            <TimeRange
              currentTime={currentTime1}
              duration={100}
              bufferedTime={30}
              onChange={this.onChange1}
            />
          </TimeRangeWrapper>
          {currentTime2}
          <TimeRangeWrapper>
            <TimeRange
              currentTime={currentTime2}
              duration={100}
              bufferedTime={0}
              onChange={this.onChange2}
            />
          </TimeRangeWrapper>
          <TimeRangeWrapper style={{ marginLeft: 100, width: 500 }}>
            <TimeRange
              currentTime={currentTime3}
              duration={100}
              bufferedTime={20}
              onChange={this.onChange3}
            />
          </TimeRangeWrapper>
        </Group>
      </Container>
    );
  }
}

export default () => <Example />;
