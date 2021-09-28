/* eslint-disable @repo/internal/react/no-class-components */
import React, { Component } from 'react';

import styled from 'styled-components';

import Button from '@atlaskit/button/standard-button';

import { ProgressIndicator } from '../../src';

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface ExampleProps {
  selectedIndex: number;
  values: Array<string>;
}

interface State {
  selectedIndex: number;
}

export default class Example extends Component<ExampleProps, State> {
  static defaultProps = {
    selectedIndex: 0,
    values: ['first', 'second', 'third'],
  };

  state = {
    selectedIndex: this.props.selectedIndex,
  };

  handlePrev = () => {
    this.setState((prevState) => ({
      selectedIndex: prevState.selectedIndex - 1,
    }));
  };

  handleNext = () => {
    this.setState((prevState) => ({
      selectedIndex: prevState.selectedIndex + 1,
    }));
  };

  render() {
    const { values } = this.props;
    const { selectedIndex } = this.state;
    return (
      <Footer>
        <Button isDisabled={selectedIndex === 0} onClick={this.handlePrev}>
          Prev
        </Button>
        <ProgressIndicator
          spacing="compact"
          selectedIndex={selectedIndex}
          values={values}
        />
        <Button
          isDisabled={selectedIndex === values.length - 1}
          onClick={this.handleNext}
        >
          Next
        </Button>
      </Footer>
    );
  }
}