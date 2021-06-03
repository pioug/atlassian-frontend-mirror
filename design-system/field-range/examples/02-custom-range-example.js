import React, { PureComponent } from 'react';
import styled from 'styled-components';
import FieldRange from '../src';

const Container = styled.div`
  width: 500px;
`;

export default class BasicExample extends PureComponent {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
    rangeValue: 50,
  };

  onChange = (value) => {
    this.setState({
      onChangeResult: `onChange called with value: ${value}`,
      rangeValue: value,
    });
  };

  render() {
    return (
      <div>
        <Container>
          <FieldRange
            value={this.state.rangeValue}
            min={0}
            max={50}
            step={1}
            onChange={this.onChange}
          />
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
          Range: 0-50. Step: 1. {this.state.onChangeResult}
        </div>
      </div>
    );
  }
}
