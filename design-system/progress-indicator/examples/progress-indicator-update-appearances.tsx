/* eslint-disable @repo/internal/react/no-class-components */
/** @jsx jsx */
import { Component, FC } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { ProgressIndicator } from '../src';
import { DotsAppearance } from '../src/components/types';

const footerStyles = css({
  display: 'flex',
  margin: '16px',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Footer: FC = (props) => <footer css={footerStyles} {...props} />;

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
      <Footer>
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
      </Footer>
    );
  }
}

export default Example;
