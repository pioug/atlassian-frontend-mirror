import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { LinkPickerAnalyticsContextType } from '../../analytics.codegen';
import { LinkPickerProps } from '../../';
import { ANALYTICS_CHANNEL } from '../constants';
import { normalizeUrl } from '@atlaskit/linking-common/url';

type AnalyticsContextAttributesType = LinkPickerAnalyticsContextType;

export type TrackAttribute = <K extends keyof LinkPickerAnalyticsContextType>(
  attribute: K,
  value: AnalyticsContextAttributesType[K],
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
    attributes: Partial<LinkPickerAnalyticsContextType>,
  ) => void;
  /**
   * Retrieve the current set of attributes
   * Can be used by components to derive/compute new attributes for specific events
   */
  getAttributes: () => LinkPickerAnalyticsContextType;
}

const DEFAULT_CONTEXT_ATTRIBUTES: LinkPickerAnalyticsContextType = {
  linkState: 'newLink',
  linkFieldContent: null,
  linkFieldContentInputMethod: null,
  linkFieldContentInputSource: null,
  displayTextFieldContent: null,
  displayTextFieldContentInputMethod: null,
  tab: null,
};

const LinkPickerAnalyticsContext = React.createContext<AnalyticsContextType>({
  trackAttribute: () => {},
  trackAttributes: () => {},
  getAttributes: () => DEFAULT_CONTEXT_ATTRIBUTES,
});

/**
 * TODO: Should we hook this into the form state/reducer?
 * This function continues to duplicate / assume logic that runs in the picker
 */
const contextAttributesFromIntialProps = <
  P extends Pick<LinkPickerProps, 'url' | 'displayText' | 'plugins'>,
>(
  props: P,
) => {
  return {
    linkState: normalizeUrl(props.url) ? 'editLink' : 'newLink',
    linkFieldContent: normalizeUrl(props.url) ? 'url' : null,
    displayTextFieldContent: Boolean(props.displayText) ? 'text_string' : null,
    // TODO: Assumes we alway load the first plugin as the current tab
    tab: props.plugins?.[0]?.tabKey ?? null,
  } as const;
};

/**
 * Context for tracking attributes to deliver at a context-level
 */
const LinkPickerAnalytics = ({
  initialContext,
  children,
}: React.PropsWithChildren<{
  initialContext?: Partial<LinkPickerAnalyticsContextType>;
}>) => {
  const dataRef: React.MutableRefObject<LinkPickerAnalyticsContextType> =
    useRef<LinkPickerAnalyticsContextType>({
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
    <LinkPickerAnalyticsContext.Provider value={methods}>
      {children}
    </LinkPickerAnalyticsContext.Provider>
  );
};

/**
 * Hook that exposes the context-level attribute getters and setters.
 */
export const useLinkPickerAnalytics = () =>
  useContext(LinkPickerAnalyticsContext);

/**
 * Wrap component in "attributes" context store and initialise the initial context attributes from props.
 */
function withLinkPickerAnalytics<P>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  return (props: P) => {
    const [initialContext] = useState(() =>
      contextAttributesFromIntialProps(props),
    );
    return (
      <LinkPickerAnalytics initialContext={initialContext} {...props}>
        <WrappedComponent {...props} />
      </LinkPickerAnalytics>
    );
  };
}

/**
 * Wraps a component with the analytics context + listener to update events with contextual-level attributes.
 * Should be implemented once at the root of the link picker.
 */
export function withLinkPickerAnalyticsContext<P>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  return withLinkPickerAnalytics((props: P) => {
    const { getAttributes } = useLinkPickerAnalytics();

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
