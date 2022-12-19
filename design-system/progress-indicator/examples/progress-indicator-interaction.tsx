/* eslint-disable @repo/internal/react/no-class-components */
import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';

import { ProgressIndicator } from '../src';

const SpreadInlineLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Inline gap="scale.100" justifyContent="space-between" alignItems="center">
      {children}
    </Inline>
  );
};

interface ExampleProps {
  selectedIndex: number;
  values: Array<string>;
}

interface State {
  selectedIndex: number;
}

class Example extends Component<ExampleProps, State> {
  static defaultProps = {
    selectedIndex: 0,
    values: ['first', 'second', 'third'],
  };

  state = {
    selectedIndex: this.props.selectedIndex,
  };

  /* eslint-disable */
  /* prettier-ignore */
  handleSelect = ({
    event,
    index: selectedIndex,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    index: number;
  }): void => {
    this.setState({ selectedIndex });
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
      <Box paddingInline="scale.200" paddingBlock="scale.200" display="block">
        <SpreadInlineLayout>
          <Button isDisabled={selectedIndex === 0} onClick={this.handlePrev}>
            Prev
          </Button>
          <ProgressIndicator
            onSelect={this.handleSelect}
            selectedIndex={selectedIndex}
            values={values}
            size="default"
          />
          <Button
            isDisabled={selectedIndex === values.length - 1}
            onClick={this.handleNext}
          >
            Next
          </Button>
        </SpreadInlineLayout>
      </Box>
    );
  }
}

export default Example;
