import React, { PureComponent } from 'react';
import styled from 'styled-components';
import FieldRange from '../src';

const Container = styled.div`
  width: 500px;
  max-width: 100%;
`;

const CustomValueInput = styled.input`
  width: 50px;
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

  onCustomValueChange = (e) => {
    const rangeValue = e.target.value;

    this.setState({ rangeValue });
  };

  render() {
    const { rangeValue, onChangeResult } = this.state;

    return (
      <div>
        <Container>
          <FieldRange
            value={rangeValue}
            min={0}
            max={100}
            step={1}
            onChange={this.onChange}
          />
          Value:{' '}
          <CustomValueInput
            type="number"
            value={rangeValue}
            max={100}
            onChange={this.onCustomValueChange}
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
          Range: 0-100. Step: 1. {onChangeResult}
        </div>
      </div>
    );
  }
}
