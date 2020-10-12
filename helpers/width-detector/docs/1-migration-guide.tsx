import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
\`WidthObserver\` is a utility component that observes the current width and calls the \`setWidth\` callback every time this changes.

  ## Usage

  ${code`import { WidthObserver } from '@atlaskit/width-detector';`}

  ${(
    <Example
      packageName="@atlaskit/width-detector"
      Component={require('../examples/4-on-resize-width-observer').default}
      title="Basic WidthObserver"
      source={require('!!raw-loader!../examples/4-on-resize-width-observer')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/width-detector"
      Component={require('../examples/5-resizing-box-width-observer').default}
      title="Resizing box"
      source={require('!!raw-loader!../examples/5-resizing-box-width-observer')}
    />
  )}

  ${(
    <Props
      heading="WidthObserver Props"
      props={require('!!extract-react-types-loader!../src/WidthObserver/index')}
    />
  )}

  ## Migration guide

  This component will observe the current width,
  and it will call the \`setWidth\` callback every time this changes.
 
  The only required is the parent \`HTMLElement\` should have \`position: relative\`
  because this is an absolute element.

  ### Before:

  ${code`<WidthDetector>
      {(width: number | void) => <WrappedComponent {...props} containerWidth={width} />}
  </WidthDetector>;`}

  ### After:

  ${code`const [width, setWidth] = useState<number | void>(undefined);
const throttledSetWidth = _.throttle(setWidth, 50);
  
  return (
      <>
          <RelativeWrapper>
              <WidthObserver setWidth={throttledSetWidth} />
          </RelativeWrapper>
          <WrappedComponent {...props} containerWidth={width} />
      </>
  );`}


  **FALLBACKS:**
  This component relies on \`ResizerObserver\` API, but some browsers do not support it,
  for example - IE11 and Edge 18.
 
  For those browsers, we are using an iframe to listen when a component was resized.
  However, we should not create an iframe for every call, so you need to use the \`IframeWidthObserverFallbackWrapper\`
  as parent for all \`WidthObserver\`.

  This Wrapper will not create an iframe when the browser support \`ResizeObserverAPI\`.

  ${code`<IframeWidthObserverFallbackWrapper>
  <BigComponent>
    <div>
      <WidthObserver />
    <div>

    {anyArrayofElements.map(elem => {
       return (
         <div>
           <WidthObserver />
         </div>
       );
    }))}
  </BigComponent>
</IframeWidthObserverFallbackWrapper>`}

`;
