/* eslint-disable @repo/internal/react/no-class-components */
import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import Stack from '@atlaskit/ds-explorations/stack';
import Text from '@atlaskit/ds-explorations/text';

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

type Sizes = 'small' | 'default' | 'large';
type Spacing = 'comfortable' | 'cozy' | 'compact';

const sizes: Sizes[] = ['small', 'default', 'large'];
const spacings: Spacing[] = ['comfortable', 'cozy', 'compact'];
class Example extends Component<ExampleProps, State> {
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
      <Box paddingInline="scale.200" paddingBlock="scale.200" display="block">
        <SpreadInlineLayout>
          <Button isDisabled={selectedIndex === 0} onClick={this.handlePrev}>
            Prev
          </Button>
          <Inline gap="scale.300" testId="vr-hook">
            {sizes.map((size) => (
              <Stack gap="scale.200">
                <Text fontWeight="700">{size}</Text>
                {spacings.map((space) => (
                  <Stack gap="scale.100">
                    <Text>{space}</Text>
                    <ProgressIndicator
                      selectedIndex={selectedIndex}
                      values={values}
                      size={size}
                      spacing={space}
                    />
                  </Stack>
                ))}
              </Stack>
            ))}
          </Inline>
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
