/* eslint-disable @repo/internal/react/no-class-components */
import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';

import { ProgressIndicator } from '../src';
import { DotsAppearance } from '../src/components/types';

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
  values: Array<DotsAppearance>;
}

interface State {
  selectedIndex: number;
}

class Example extends Component<ExampleProps, State> {
  static defaultProps = {
    selectedIndex: 0,
    values: ['default', 'inverted', 'primary', 'help'],
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
      <Box paddingInline="scale.200" paddingBlock="scale.200" display="block">
        <SpreadInlineLayout>
          <Button isDisabled={selectedIndex === 0} onClick={this.handlePrev}>
            Prev
          </Button>
          <ProgressIndicator
            selectedIndex={selectedIndex}
            values={values}
            appearance={values[selectedIndex]}
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
