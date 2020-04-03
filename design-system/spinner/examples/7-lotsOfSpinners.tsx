import React from 'react';
import styled from 'styled-components';

import Spinner from '../src';

type State = {
  spinners: number[];
  showSpinners: boolean;
  size: number;
};

const Container = styled.div`
  width: 400px;
`;

const SpinnerContainer = styled.li`
  width: 33%;
  display: inline-block;
`;

const Input = styled.input`
  margin: 10px 5px;
`;

export default class App extends React.Component<{}, State> {
  state = {
    spinners: [...Array(100).keys()],
    showSpinners: false,
    size: 20,
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      size: +e.target.value,
    });
  };

  toggleSpinners = () => {
    this.setState({
      showSpinners: !this.state.showSpinners,
    });
  };

  render() {
    return (
      <div>
        <p>
          This example tests spinner performance to ensure lots of spinners
          render in a timely fashion. Unfortunately an issue exists with our
          current version of styled-components that causes performance issues
          when dynamically creating keyframe animations. As a result, custom
          spinner sizes will slightly decrease performance.
        </p>
        <Container>
          Spinner size:
          <Input
            style={{ marginLeft: '5px' }}
            type="number"
            value={this.state.size}
            min={0}
            max={100}
            step={1}
            onChange={this.onChange}
          />
        </Container>
        <button onClick={this.toggleSpinners}>Toggle spinners</button>
        <ul>
          {this.state.spinners.map(spinner => {
            return (
              <SpinnerContainer key={spinner}>
                Spinner {spinner}{' '}
                {this.state.showSpinners ? (
                  <Spinner delay={200} size={this.state.size} />
                ) : null}
              </SpinnerContainer>
            );
          })}
        </ul>
      </div>
    );
  }
}
