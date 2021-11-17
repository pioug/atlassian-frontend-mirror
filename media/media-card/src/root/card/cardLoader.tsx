import React, { useContext } from 'react';
import type {
  WithMediaClientConfigProps,
  WithMediaClientFunction,
} from '@atlaskit/media-client';
import { useMemoizeFeatureFlags } from '@atlaskit/media-common';
import Loadable from 'react-loadable';
import { CardLoading } from '../..';
import type { CardWithAnalyticsEventsProps } from '.';
import type { MediaCardAnalyticsErrorBoundaryProps } from '../media-card-analytics-error-boundary';

export type CardWithMediaClientConfigProps = WithMediaClientConfigProps<
  CardWithAnalyticsEventsProps
>;

const MediaCardContext = React.createContext({});

const CardLoadingWithContext: React.FC<{}> = () => {
  const props = useContext(MediaCardContext);
  return <CardLoading {...props} />;
};

const MediaCard = Loadable({
  loader: (): Promise<React.ComponentType<CardWithAnalyticsEventsProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_media-card" */ './index'
    ).then((mod) => mod.Card),
  loading: () => <CardLoadingWithContext />,
});

const MediaCardErrorBoundary = Loadable({
  loader: (): Promise<
    React.ComponentType<MediaCardAnalyticsErrorBoundaryProps>
  > =>
    import(
      /* webpackChunkName: "@atlaskit-internal_media-card-error-boundary" */ '../media-card-analytics-error-boundary'
    ).then((mod) => mod.default),
  loading: () => <CardLoadingWithContext />,
});

const MediaCardWithMediaClient = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
    ),
  loading: () => <CardLoadingWithContext />,
  render: (loaded, props: CardWithMediaClientConfigProps) => (
    <CardWithMediaClient {...props} withMediaClient={loaded.withMediaClient} />
  ),
});

const CardWithMediaClient: React.FC<
  CardWithMediaClientConfigProps & {
    withMediaClient: WithMediaClientFunction;
  }
> = (props) => {
  const { withMediaClient, featureFlags } = props;
  const memoizedFeatureFlags = useMemoizeFeatureFlags(featureFlags);
  const Card = React.useMemo(() => {
    return withMediaClient(MediaCard, memoizedFeatureFlags);
  }, [withMediaClient, memoizedFeatureFlags]);

  return (
    <MediaCardErrorBoundary>
      <Card {...props} />
    </MediaCardErrorBoundary>
  );
};

const CardLoader: React.FC<CardWithMediaClientConfigProps> = (props) => {
  return (
    <MediaCardContext.Provider value={props}>
      <MediaCardWithMediaClient {...props} />
    </MediaCardContext.Provider>
  );
};

export default CardLoader;
