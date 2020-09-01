import React from 'react';

import rafSchedule from 'raf-schd';
import styled from 'styled-components';

import { WidthObserver } from '@atlaskit/width-detector';

export type Breakpoints = 'S' | 'M' | 'L';

export type WidthConsumerContext = {
  width: number;
  breakpoint: Breakpoints;
};

const SCROLLBAR_WIDTH = 30;

export function getBreakpoint(width: number = 0): Breakpoints {
  const MAX_S = 1266;
  const MAX_M = 2146;

  if (width >= MAX_S && width < MAX_M) {
    return 'M';
  } else if (width >= MAX_M) {
    return 'L';
  }

  return 'S';
}

export function createWidthContext(width: number = 0): WidthConsumerContext {
  return { width, breakpoint: getBreakpoint(width) };
}

export const WidthContext = React.createContext(createWidthContext());

const { Provider, Consumer } = WidthContext;

const RelativeContainer = React.memo(styled.div`
  position: relative;
  width: 100%;
`);

export type WidthProviderState = {
  width?: number;
};

type WidthProviderProps = {
  className?: string;
};

export class WidthProvider extends React.Component<
  WidthProviderProps,
  WidthProviderState
> {
  state = { width: 0 };

  constructor(props: any) {
    super(props);
    this.state.width = document.body.offsetWidth;
  }

  render() {
    return (
      <RelativeContainer className={this.props.className}>
        <WidthObserver setWidth={this.setWidth} offscreen />
        <Provider value={createWidthContext(this.state.width)}>
          {this.props.children}
        </Provider>
      </RelativeContainer>
    );
  }

  setWidth = rafSchedule((width: number) => {
    // Ignore changes that are less than SCROLLBAR_WIDTH, otherwise it can cause infinite re-scaling
    if (Math.abs(this.state.width - width) < SCROLLBAR_WIDTH) {
      return;
    }
    this.setState({ width });
  });
}

export { Consumer as WidthConsumer };
