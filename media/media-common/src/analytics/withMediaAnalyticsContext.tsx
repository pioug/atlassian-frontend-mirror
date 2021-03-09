import React, { forwardRef, useMemo } from 'react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import { MediaFeatureFlags, getMediaFeatureFlag } from '../mediaFeatureFlags';
import {
  ContextPublicAttributes,
  ContextPrivateAttributes,
  ContextStaticProps,
  ContextData,
} from './types';

const getFilteredFeatureFlags = (
  keys: Array<keyof MediaFeatureFlags>,
  featureFlags: MediaFeatureFlags,
): MediaFeatureFlags =>
  keys.reduce(
    (result, key) => ({
      ...result,
      [key]: getMediaFeatureFlag(key, featureFlags),
    }),
    {} as MediaFeatureFlags,
  );

/**
 * HOC for attaching MediaAnalyticsContext to a top-level React Component.
 *
 * Similar than "packages/analytics/analytics-next/src/hocs/withAnalyticsContext.tsx",
 * except that we restrict attributes put in this context using ContextPublicAttributes and ContextPrivateAttributes.
 *
 * As a constraint, the wrapped React Component's props must extend ContextStaticProps.
 *
 * @param {ContextPublicAttributes} attributes public attributes to put in context
 *
 * @see packages/analytics/analytics-next/src/hocs/withAnalyticsContext.tsx
 */
export const withMediaAnalyticsContext = (
  contextPublicAttributes: ContextPublicAttributes,
  options: { filterFeatureFlags?: Array<keyof MediaFeatureFlags> } = {},
) => <
  Props extends ContextStaticProps,
  Component extends React.ComponentType<Props>
>(
  WrappedComponent: React.JSXElementConstructor<Props> & Component,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<JSX.LibraryManagedAttributes<Component, Props>> &
    React.RefAttributes<any>
> => {
  type WrappedProps = JSX.LibraryManagedAttributes<Component, Props>;

  // forwardRef() allows passing React refs to the wrapped component WithMediaAnalyticsContext
  const WithMediaAnalyticsContext = forwardRef<any, WrappedProps>(
    (props, ref) => {
      const { featureFlags } = props;
      const { filterFeatureFlags } = options;

      const contextData = useMemo<ContextData>(() => {
        const filteredFlags =
          filterFeatureFlags && featureFlags
            ? getFilteredFeatureFlags(filterFeatureFlags, featureFlags)
            : featureFlags;

        const contextPrivateAttributes: ContextPrivateAttributes = {
          featureFlags: filteredFlags,
        };

        return {
          ...contextPublicAttributes,
          [MEDIA_CONTEXT]: {
            ...contextPrivateAttributes,
          },
        };
      }, [filterFeatureFlags, featureFlags]);

      return (
        <AnalyticsContext data={contextData}>
          <WrappedComponent {...props} ref={ref} />
        </AnalyticsContext>
      );
    },
  );

  WithMediaAnalyticsContext.displayName = `WithMediaAnalyticsContext(${
    // @ts-ignore displayName doesn't exist on type
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithMediaAnalyticsContext;
};
