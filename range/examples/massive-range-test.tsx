import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Range from '../src';

const Container = styled.div`
  width: 500px;
`;

interface State {
  onChangeResult: string;
}

const max = 100000;

export default class BasicExample extends PureComponent<{}, State> {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };

  onChange = (value: any) => {
    this.setState({
      onChangeResult: `onChange called with value: ${value}`,
    });
  };

  render() {
    const { onChangeResult } = this.state;

    return (
      <div>
        <Container>
          <Range max={100000} step={1} onChange={this.onChange} />
          Value:{' '}
        </Container>
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          Range: 0-{max}. Step: 1. {onChangeResult}
        </div>
      </div>
    );
  }
}
