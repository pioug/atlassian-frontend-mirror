import React from 'react';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { CardLoading } from '../..';
import { MediaCardAnalyticsErrorBoundaryProps } from '../media-card-analytics-error-boundary';
import { CardWithAnalyticsEventsProps } from '.';

export type CardWithMediaClientConfigProps = WithMediaClientConfigProps<
  CardWithAnalyticsEventsProps
>;

type CardWithMediaClientConfigComponent = React.ComponentType<
  CardWithMediaClientConfigProps
>;

type MediaCardErrorBoundaryComponent = React.ComponentType<
  MediaCardAnalyticsErrorBoundaryProps
>;

export interface AsyncCardState {
  Card?: CardWithMediaClientConfigComponent;
  MediaCardErrorBoundary?: MediaCardErrorBoundaryComponent;
}

export default class CardLoader extends React.PureComponent<
  CardWithMediaClientConfigProps & AsyncCardState,
  AsyncCardState
> {
  static displayName = 'AsyncCard';
  static Card?: CardWithMediaClientConfigComponent;
  static MediaCardErrorBoundary?: MediaCardErrorBoundaryComponent;

  state: AsyncCardState = {
    Card: CardLoader.Card,
    MediaCardErrorBoundary: CardLoader.MediaCardErrorBoundary,
  };

  async componentDidMount() {
    if (!this.state.Card) {
      try {
        const [
          mediaClient,
          cardModule,
          mediaCardErrorBoundaryModule,
        ] = await Promise.all([
          import(
            /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-card" */ './index'
          ),
          import(
            /* webpackChunkName: "@atlaskit-internal_media-card-error-boundary" */ '../media-card-analytics-error-boundary'
          ),
        ]);

        CardLoader.Card = mediaClient.withMediaClient(
          cardModule.Card,
          this.props.featureFlags,
        );
        CardLoader.MediaCardErrorBoundary =
          mediaCardErrorBoundaryModule.default;

        this.setState({
          Card: CardLoader.Card,
          MediaCardErrorBoundary: CardLoader.MediaCardErrorBoundary,
        });
      } catch (error) {
        // TODO [MS-2278]: Add operational error to catch async import error
      }
    }
  }

  render() {
    const { dimensions, testId, featureFlags } = this.props;
    const { Card, MediaCardErrorBoundary } = this.state;

    if (!Card || !MediaCardErrorBoundary) {
      return (
        <CardLoading
          testId={testId}
          dimensions={dimensions}
          featureFlags={featureFlags}
        />
      );
    }

    return (
      <MediaCardErrorBoundary>
        <Card {...this.props} />
      </MediaCardErrorBoundary>
    );
  }
}
