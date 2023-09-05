import React, { useContext } from 'react';
import type { MediaClient } from '@atlaskit/media-client';
import Loadable from 'react-loadable';
import { CardLoading } from '../../utils/lightCards/cardLoading';
import type { CardBaseProps } from '../card';
import type { MediaCardAnalyticsErrorBoundaryProps } from '../media-card-analytics-error-boundary';
import { CardWithMediaClientConfigProps } from '../cardLoader';

const MediaCardContext = React.createContext({});

const CardLoadingWithContext: React.FC<{}> = () => {
  const props = useContext(MediaCardContext);
  return <CardLoading {...props} />;
};

const MediaV2Card = Loadable({
  loader: (): Promise<React.ComponentType<CardBaseProps>> =>
    import(
      /* webpackChunkName: "@atlaskit-internal_media-card-v2" */ './cardV2'
    ).then((mod) => mod.CardV2),
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

const MediaCardWithMediaClient: React.FC<
  CardWithMediaClientConfigProps & {
    useMediaClient: () => MediaClient;
  }
> = (props) => {
  const { dimensions, onClick, useMediaClient, featureFlags } = props;
  const mediaClient = useMediaClient();
  const featureFlagsWithMediaCardV2 = React.useMemo(
    () => ({
      ...featureFlags,
      mediaCardV2: true, //used for analytics - internal use only
    }),
    [featureFlags],
  );
  return (
    <MediaCardErrorBoundary dimensions={dimensions} onClick={onClick}>
      <MediaV2Card
        {...props}
        featureFlags={featureFlagsWithMediaCardV2}
        mediaClient={mediaClient}
      />
    </MediaCardErrorBoundary>
  );
};

const MediaCardWithMediaClientProvider = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_media-client-react" */ '@atlaskit/media-client-react'
    ),
  loading: () => <CardLoadingWithContext />,
  render: (loaded, props: CardWithMediaClientConfigProps) => {
    const mediaCard = (
      <MediaCardWithMediaClient
        {...props}
        useMediaClient={loaded.useMediaClient}
      />
    );
    return (
      <loaded.MediaClientContext.Consumer>
        {(value) =>
          value ? (
            mediaCard
          ) : (
            // TODO - make clientConfig optional
            <loaded.MediaClientProvider clientConfig={props.mediaClientConfig}>
              {mediaCard}
            </loaded.MediaClientProvider>
          )
        }
      </loaded.MediaClientContext.Consumer>
    );
  },
});

const CardLoader: React.FC<CardWithMediaClientConfigProps> = (props) => {
  return (
    <MediaCardContext.Provider value={props}>
      <MediaCardWithMediaClientProvider {...props} />
    </MediaCardContext.Provider>
  );
};

export default CardLoader;
