import React, { FunctionComponent, useRef, useState, useEffect } from 'react';

import { useInView } from './hooks';
import { WidthObserverProps } from './types';
import { browser, getIEVersion } from './utils';

type Unsubscribe = () => void;
type SubscriptionCallback = (callback: Function) => Unsubscribe;
const emptySubscribe: SubscriptionCallback = () => () => {};

type IframeContext = {
  subscribe: SubscriptionCallback | null;
};
type SubscribeProps = {
  subscribe: SubscriptionCallback;
} & WidthObserverProps;
type IframeWidthObserverProps = {
  useIntersectionObserver: boolean;
} & WidthObserverProps;
type IframeProps = {
  onResize: () => void;
};

const {
  Consumer: IframeWrapperConsumer,
  Provider: IframeWrapperProvider,
} = React.createContext<IframeContext>({
  subscribe: null,
});

function ObjectIframe(props: IframeProps) {
  const { onResize } = props;
  const ref = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    const { current: iframe } = ref;

    if (!iframe.contentDocument || !iframe.contentDocument.defaultView) {
      return;
    }

    const iframeWindow = iframe.contentDocument.defaultView;
    iframeWindow.addEventListener('resize', onResize);

    return () => {
      iframeWindow.removeEventListener('resize', onResize);
    };
  }, [ref, onResize]);

  return (
    <object
      ref={ref}
      data="about:blank"
      type="text/html"
      style={{ position: 'absolute', height: '0', width: '100%' }}
      aria-hidden
      tabIndex={-1}
    />
  );
}

/**
 * IE11 requires IFrame with src to avoid Access Denied error.
 *
 * https://stackoverflow.com/questions/1886547/access-is-denied-javascript-error-when-trying-to-access-the-document-object-of
 **/
function NativeIframe(props: IframeProps) {
  const { onResize } = props;
  const ref = useRef<HTMLIFrameElement>(null);
  const onLoad = React.useCallback(() => {
    if (!ref || !ref.current) {
      return;
    }

    const { current: iframe } = ref;

    if (!iframe.contentDocument || !iframe.contentDocument.defaultView) {
      return;
    }
    const iframeWindow = iframe.contentDocument.defaultView;
    iframeWindow.addEventListener('resize', onResize);
  }, [onResize]);

  return (
    <iframe
      ref={ref}
      src="about:blank"
      frameBorder="0"
      style={{ position: 'absolute', height: '0', width: '100%' }}
      onLoad={onLoad}
      aria-hidden
      tabIndex={-1}
    />
  );
}

function Iframe(props: IframeProps) {
  if (getIEVersion() === 11) {
    return <NativeIframe {...props} />;
  }

  return <ObjectIframe {...props} />;
}

const IframeWrapper: FunctionComponent = ({ children }) => (
  <div
    style={{
      position: 'absolute',
      height: '0',
      width: '100%',
    }}
  >
    {children}
  </div>
);

const emptySubscription: SubscriptionCallback = () => () => {};

const SubscribeIframeResize = React.memo(
  ({ subscribe, setWidth }: SubscribeProps) => {
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref && ref.current) {
        const { current: target } = ref;
        const width = target.offsetWidth;
        setWidth(width);
      }

      const unsubscribe = subscribe(() => {
        if (ref && ref.current) {
          const { current: target } = ref;
          const width = target.offsetWidth;
          setWidth(width);
        }
      });

      return unsubscribe;
    }, [ref, subscribe, setWidth]);
    return <div ref={ref} />;
  },
);

const SubscribeIframeResizeWhenVisible = React.memo(
  ({ subscribe, setWidth }: SubscribeProps) => {
    const [inViewRef, inView, target, entry] = useInView({
      /* Optional options */
      threshold: 0,
    });

    useEffect(() => {
      if (inView && entry && entry.target instanceof HTMLElement) {
        const { boundingClientRect } = entry;
        const width = boundingClientRect.width;
        setWidth(width);
      }

      const unsubscribe = subscribe(() => {
        // The first time the component is mounted will need to
        // get this information from the HTMLElement
        if (inView && target instanceof HTMLElement) {
          const width = target.offsetWidth;
          setWidth(width);
        }
      });

      return unsubscribe;
    }, [inView, entry, setWidth, subscribe, target]);

    return (
      <div
        style={{
          position: 'absolute',
          height: '0',
          width: '100%',
        }}
        ref={inViewRef}
      />
    );
  },
);

function getSubscribeIframe(useIntersectionObserver: boolean) {
  if (useIntersectionObserver) {
    return SubscribeIframeResizeWhenVisible;
  }

  return SubscribeIframeResize;
}

/**
 * This component is responsible for creating an iframe using HTMLObjectElement.
 * It will provide a context object with a `subscribe` function as a callback,
 * so other components can subscribe to know when the iframe was resized.
 */
const IframeWidthObserverFallback = React.memo(
  (props: { children?: React.ReactNode }) => {
    const [listeners] = useState(new Map());
    const subscribe = React.useCallback(
      (cb) => {
        listeners.set(cb, null);
        return () => {
          listeners.delete(cb);
        };
      },
      [listeners],
    );

    const onResize = React.useCallback(() => {
      listeners.forEach((_, cb) => cb());
    }, [listeners]);

    return (
      <>
        <IframeWrapper>
          <Iframe onResize={onResize} />
        </IframeWrapper>

        <IframeWrapperProvider value={{ subscribe }}>
          {props.children}
        </IframeWrapperProvider>
      </>
    );
  },
);

const NonIframeWidthObserverFallback = React.memo(
  (props: { children?: React.ReactNode }) => {
    return (
      <IframeWrapperProvider value={{ subscribe: emptySubscribe }}>
        {props.children}
      </IframeWrapperProvider>
    );
  },
);

export {
  IframeWrapperConsumer,
  IframeWrapperProvider,
  IframeWidthObserverFallback,
  SubscribeIframeResizeWhenVisible,
  SubscribeIframeResize,
};

export const IframeWidthObserver = React.memo(
  ({ setWidth, useIntersectionObserver }: IframeWidthObserverProps) => {
    const Component = getSubscribeIframe(useIntersectionObserver);

    return (
      <IframeWrapperConsumer>
        {({ subscribe }) => (
          <Component
            setWidth={setWidth}
            subscribe={subscribe || emptySubscription}
          />
        )}
      </IframeWrapperConsumer>
    );
  },
);

export const IframeWidthObserverFallbackWrapper = React.memo(
  (props: { children?: React.ReactNode }) => {
    const { supportsResizeObserver, supportsIntersectionObserver } = browser;

    if (supportsResizeObserver && supportsIntersectionObserver) {
      return (
        <NonIframeWidthObserverFallback>
          {props.children}
        </NonIframeWidthObserverFallback>
      );
    }

    return (
      <IframeWidthObserverFallback>
        {props.children}
      </IframeWidthObserverFallback>
    );
  },
);
