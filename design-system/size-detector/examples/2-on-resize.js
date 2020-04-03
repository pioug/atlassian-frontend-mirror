import React, { Component } from 'react';
import styled from 'styled-components';
import SizeDetector from '../src';

const ResultBox = styled.div`
  align-items: center;
  background-color: rebeccapurple;
  color: white;
  display: flex;
  height: 100%;
  justify-content: center;
  white-space: nowrap;
`;

export default class Example extends Component {
  state = {};

  onResize = ({ width, height }) => {
    this.setState({
      width,
      height,
    });
  };

  displayResults = () => (
    <ResultBox>
      {this.state.width} x {this.state.height}
    </ResultBox>
  );

  render() {
    return (
      <div>
        <div style={{ height: 100 }}>
          <SizeDetector onResize={this.onResize}>
            {this.displayResults}
          </SizeDetector>
        </div>
      </div>
    );
  }
}
