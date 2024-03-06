/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';

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

export type WidthProviderState = {
  width?: number;
};

type WidthProviderProps = {
  className?: string;
  shouldCheckExistingValue?: boolean;
  children?: React.ReactNode;
};

export const WidthProvider = ({
  className,
  shouldCheckExistingValue,
  children,
}: WidthProviderProps) => {
  const existingContextValue: WidthConsumerContext =
    React.useContext(WidthContext);
  const [width, setWidth] = React.useState(
    typeof document !== 'undefined' ? document.body.offsetWidth : 0,
  );
  const providerValue = React.useMemo(() => createWidthContext(width), [width]);

  const updateWidth = rafSchedule((nextWidth: number) => {
    // Ignore changes that are less than SCROLLBAR_WIDTH, otherwise it can cause infinite re-scaling
    if (Math.abs(width - nextWidth) < SCROLLBAR_WIDTH) {
      return;
    }
    setWidth(nextWidth);
  });

  const skipWidthDetection =
    shouldCheckExistingValue && existingContextValue.width > 0;

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
      `}
      className={className}
    >
      {!skipWidthDetection && (
        <Fragment>
          <WidthObserver setWidth={updateWidth} offscreen />
          <Provider value={providerValue}>{children}</Provider>
        </Fragment>
      )}
      {skipWidthDetection && children}
    </div>
  );
};

export { Consumer as WidthConsumer };
