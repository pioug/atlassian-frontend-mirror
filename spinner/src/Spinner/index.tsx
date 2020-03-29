import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

import { SIZES_MAP, DEFAULT_SIZE } from './constants';
import Container from './styledContainer';
import Svg from './styledSvg';
import { SpinnerProps, SpinnerState } from '../types';

const Outer = styled.span`
  display: inline-block;
  vertical-align: middle;
`;
Outer.displayName = 'Outer';

export default class Spinner extends Component<SpinnerProps, SpinnerState> {
  static defaultProps = {
    delay: 100,
    isCompleting: false,
    invertColor: false,
    onComplete: () => {},
    size: 'medium',
  };

  transitionNode: Transition | null = null;

  constructor(props: SpinnerProps) {
    super(props);
    this.state = {
      phase: '',
    };
  }

  enter = () => {
    const { delay } = this.props;
    if (delay) {
      this.setState({ phase: 'DELAY' });
    } else {
      this.setState({ phase: 'ENTER' });
    }
  };

  idle = () => {
    this.setState({ phase: 'IDLE' });
  };

  exit = () => {
    this.setState({ phase: 'LEAVE' });
  };

  endListener = (node: HTMLElement, done: () => void) => {
    const executeCallback = (event: Event): void => {
      // ignore animation events on the glyph

      if ((event.target as SVGElement).tagName === 'svg') {
        return;
      }
      if (this.state.phase === 'DELAY') {
        this.setState({ phase: 'ENTER' });
        this.endListener(node, done);
      } else {
        done();
      }
      return node && node.removeEventListener('animationend', executeCallback);
    };

    // FIX - jest-emotion doesn't recognise the DOM node so it can't add
    // the eventListener in the @atlaskit/button tests.
    // Should be fixed when we move to emotion@10
    if (node && node.addEventListener) {
      return node.addEventListener('animationend', executeCallback);
    }
    return done();
  };

  validateSize = () => {
    const { size } = this.props;
    const spinnerSize = SIZES_MAP[size] || size;
    return typeof spinnerSize === 'number' ? spinnerSize : DEFAULT_SIZE;
  };

  render() {
    const { phase } = this.state;
    const { delay, invertColor, isCompleting, testId } = this.props;
    const size = this.validateSize();

    const strokeWidth = Math.round(size / 10);
    const strokeRadius = size / 2 - strokeWidth / 2;
    return (
      <Outer>
        <Transition
          addEndListener={this.endListener}
          appear
          in={!isCompleting}
          mountOnEnter
          unmountOnExit
          onEnter={this.enter}
          onEntered={this.idle}
          onExit={this.exit}
          onExited={() => this.props.onComplete()}
          timeout={0}
          ref={node => {
            this.transitionNode = node;
          }}
        >
          <Container
            delay={delay / 1000}
            phase={phase}
            size={size}
            data-testid={testId}
          >
            <Svg
              focusable="false"
              height={size}
              invertColor={invertColor}
              phase={phase}
              size={size}
              viewBox={`0 0 ${size} ${size}`}
              width={size}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={size / 2} cy={size / 2} r={strokeRadius} />
            </Svg>
          </Container>
        </Transition>
      </Outer>
    );
  }
}
