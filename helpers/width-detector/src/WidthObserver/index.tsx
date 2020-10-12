import React from 'react';
import { WidthObserverProps } from './types';
import { browser } from './utils';
import {
  IframeWidthObserver,
  IframeWidthObserverFallbackWrapper,
  IframeWrapperConsumer,
} from './iframe-fallbacks';
import { WidthDetectorObserver } from './width-detector-observer';

/**
 * This component will observer the current width,
 * and it will call the `setWidth` callback every time this changes.
 *
 * The only required is the parent HTMLElement should have `position: relative`
 * because this is an absolute element.
 *
 *
 * FALLBACKS:
 * This component relies on ResizerObserver API, but some browsers do not support it,
 * for example, IE11 and Edge 18.
 *
 * For those browsers, we are using an iframe to listening when a component was resized.
 * However, we should not create an iframe for every call, so you need to use the `IframeWidthObserverFallbackWrapper`
 * as parent for all `WidthObserver`.
 *
 * This Wrapper will not create a iframe when the browser support ResizeObserverAPI.
 * ```
 *  <IframeWidthObserverFallbackWrapper>
 *    <BigComponent>
 *      <div>
 *        <WidthObserver />
 *      <div>
 *
 *      {anyArrayofElements.map(elem => {
 *         return (
 *           <div>
 *             <WidthObserver />
 *           </div>
 *         );
 *      }))}
 *    </BigComponent>
 *  </IframeWidthObserverFallbackWrapper>
 * ```
 */
export const WidthObserver = React.memo((props: WidthObserverProps) => {
  const { supportsResizeObserver, supportsIntersectionObserver } = browser;

  if (!supportsResizeObserver) {
    return (
      <IframeWidthObserver
        setWidth={props.setWidth}
        useIntersectionObserver={supportsIntersectionObserver}
      />
    );
  }

  return (
    <WidthDetectorObserver
      setWidth={props.setWidth}
      offscreen={props.offscreen}
    />
  );
});

export default WidthObserver;

export { IframeWidthObserverFallbackWrapper, IframeWrapperConsumer };
