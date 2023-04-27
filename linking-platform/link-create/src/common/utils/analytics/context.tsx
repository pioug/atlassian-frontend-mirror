import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../constants';
import { LinkCreateProps } from '../../types';

import { LinkCreateAnalyticsContextType } from './analytics.codegen';

export type TrackAttribute = <K extends keyof LinkCreateAnalyticsContextType>(
  attribute: K,
  value: LinkCreateAnalyticsContextType[K],
) => void;

interface AnalyticsContextType {
  /**
   * Update a single attribute in the analytics context
   */
  trackAttribute: TrackAttribute;
  /**
   * Update a set of attributes in the analytics context
   */
  trackAttributes: (
    attributes: Partial<LinkCreateAnalyticsContextType>,
  ) => void;
  /**
   * Retrieve the current set of attributes
   * Can be used by components to derive/compute new attributes for specific events
   */
  getAttributes: () => LinkCreateAnalyticsContextType;
}

const UNKNOWN = 'unknown';

const DEFAULT_CONTEXT_ATTRIBUTES: LinkCreateAnalyticsContextType = {
  triggeredFrom: UNKNOWN,
  objectName: UNKNOWN,
  appearance: 'modal',
};

const LinkCreateAnalyticsContext = React.createContext<AnalyticsContextType>({
  trackAttribute: () => {},
  trackAttributes: () => {},
  getAttributes: () => DEFAULT_CONTEXT_ATTRIBUTES,
});

const LinkCreateAnalytics = ({
  initialContext,
  children,
}: React.PropsWithChildren<{
  initialContext?: Partial<LinkCreateAnalyticsContextType>;
}>) => {
  const dataRef: React.MutableRefObject<LinkCreateAnalyticsContextType> =
    useRef<LinkCreateAnalyticsContextType>({
      ...DEFAULT_CONTEXT_ATTRIBUTES,
      ...initialContext,
    });

  const methods = useMemo<AnalyticsContextType>(
    () => ({
      trackAttribute: (key, value) => {
        dataRef.current[key] = value;
      },
      trackAttributes: attributes => {
        dataRef.current = { ...dataRef.current, ...attributes };
      },
      getAttributes: () => dataRef.current,
    }),
    [],
  );

  return (
    <LinkCreateAnalyticsContext.Provider value={methods}>
      {children}
    </LinkCreateAnalyticsContext.Provider>
  );
};

const contextAttributesFromInitialProps = <
  P extends Pick<LinkCreateProps, 'groupKey' | 'entityKey' | 'triggeredFrom'>,
>(
  props: P,
) => {
  return {
    objectName: props.entityKey,
    triggeredFrom: props.triggeredFrom,
  } as const;
};

/**
 * Hook that exposes the context-level attribute getters and setters.
 */
export const useLinkCreateAnalytics = () =>
  useContext(LinkCreateAnalyticsContext);

/**
 * Wrap component in "attributes" context store and initialise the initial context attributes from props.
 */
function withLinkCreateAnalytics<
  P extends Pick<LinkCreateProps, 'groupKey' | 'entityKey' | 'triggeredFrom'>,
>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
  return (props: P) => {
    const [initialContext] = useState(() =>
      contextAttributesFromInitialProps(props),
    );
    return (
      <LinkCreateAnalytics initialContext={initialContext}>
        <WrappedComponent {...props} />
      </LinkCreateAnalytics>
    );
  };
}

/**
 * Wraps a component with the analytics context + listener to update events with contextual-level attributes.
 * Should be implemented once at the root of the link create.
 */
export function withLinkCreateAnalyticsContext<
  P extends Pick<LinkCreateProps, 'groupKey' | 'entityKey' | 'triggeredFrom'>,
>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
  return withLinkCreateAnalytics((props: P) => {
    const { getAttributes } = useLinkCreateAnalytics();

    const onEvent = useCallback(
      (event: UIAnalyticsEvent) => {
        event.update({
          attributes: {
            ...getAttributes(),
            ...(event.payload.attributes ?? {}),
          },
        });
      },
      [getAttributes],
    );

    return (
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={onEvent}>
        <WrappedComponent {...props} />
      </AnalyticsListener>
    );
  });
}
