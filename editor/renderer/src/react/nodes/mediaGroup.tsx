import React from 'react';
import type { ReactElement } from 'react';
import { PureComponent } from 'react';
import type { CardEvent } from '@atlaskit/media-card';
import { defaultImageCardDimensions } from '@atlaskit/media-card';
import type { SizeEvent, ScrollEvent } from '@atlaskit/media-filmstrip';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import type {
  EventHandlers,
  CardSurroundings,
  CardEventClickHandler,
} from '@atlaskit/editor-common/ui';
import type { Identifier } from '@atlaskit/media-client';
import type { MediaProps } from './media';
import type { MediaFeatureFlags } from '@atlaskit/media-common';

export interface MediaGroupProps {
  children?: React.ReactNode;
  eventHandlers?: EventHandlers;
  featureFlags?: MediaFeatureFlags;
  enableDownloadButton?: boolean;
}

export interface MediaGroupState {
  animate: boolean;
  offset: number;
}

export default class MediaGroup extends PureComponent<
  MediaGroupProps,
  MediaGroupState
> {
  state: MediaGroupState = {
    animate: false,
    offset: 0,
  };

  private handleSize = ({ offset }: SizeEvent) => this.setState({ offset });
  private handleScroll = ({ animate, offset }: ScrollEvent) =>
    this.setState({ animate, offset });

  render() {
    const numChildren = React.Children.count(this.props.children);

    let content;
    if (numChildren === 1) {
      const card = React.Children.toArray(
        this.props.children,
      )[0] as ReactElement<any>;
      switch (card.props.type) {
        case 'file':
          content = this.renderSingleFile(card);
          break;
        case 'link':
          content = null;
          break;
        default:
          content = this.renderSingleLink(card);
      }
    } else {
      content = this.renderStrip();
    }
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    return <div className="MediaGroup">{content}</div>;
  }

  renderSingleFile(child: ReactElement<MediaProps>) {
    return React.cloneElement(child, {
      resizeMode: 'stretchy-fit',
      cardDimensions: defaultImageCardDimensions,
      useInlinePlayer: false,
      featureFlags: this.props.featureFlags,
      enableDownloadButton: this.props.enableDownloadButton,
    } as MediaProps);
  }

  renderSingleLink(child: ReactElement<MediaProps>) {
    return React.cloneElement(child, {
      appearance: 'auto',
      featureFlags: this.props.featureFlags,
    } as MediaProps);
  }

  onMediaClick =
    (
      cardClickHandler: CardEventClickHandler,
      child: ReactElement<MediaProps>,
      surroundingItems: Identifier[],
    ) =>
    (event: CardEvent, analyticsEvent?: any) => {
      const surroundings: CardSurroundings = {
        collectionName: child.props.collection!,
        list: surroundingItems,
      };
      cardClickHandler(event, surroundings, analyticsEvent);
    };

  cloneFileCard(
    child: ReactElement<MediaProps>,
    surroundingItems: Identifier[],
  ) {
    const cardClickHandler =
      this.props &&
      this.props.eventHandlers &&
      this.props.eventHandlers.media &&
      this.props.eventHandlers.media.onClick;
    const onClick = cardClickHandler
      ? this.onMediaClick(cardClickHandler, child, surroundingItems)
      : undefined;

    return React.cloneElement(child, {
      useInlinePlayer: false,
      eventHandlers: {
        ...child.props.eventHandlers,
        media: {
          onClick,
        },
      },
      featureFlags: this.props.featureFlags,
      enableDownloadButton: this.props.enableDownloadButton,
    } as MediaProps);
  }

  renderStrip() {
    const { children } = this.props;
    const { animate, offset } = this.state;
    const childIdentifiers = React.Children.map(children, (child) => {
      if (React.isValidElement<MediaProps>(child)) {
        return this.mapMediaPropsToIdentifier(child.props);
      }
    });
    const surroundingItems = (childIdentifiers || []).filter(
      (identifier) => !!identifier,
    );

    return (
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
      >
        {React.Children.map(children, (rawChild) => {
          const child = rawChild as React.ReactElement<MediaProps>;
          switch (child.props.type) {
            case 'file':
              return this.cloneFileCard(
                child,
                surroundingItems as Identifier[],
              );
            case 'link':
              return null;
            default:
              return React.cloneElement(child, {
                featureFlags: this.props.featureFlags,
                enableDownloadButton: this.props.enableDownloadButton,
              });
          }
        })}
      </FilmstripView>
    );
  }

  private mapMediaPropsToIdentifier({
    id,
    type,
    occurrenceKey,
    collection,
  }: MediaProps): Identifier | undefined {
    switch (type) {
      case 'file':
        return {
          id: id!,
          mediaItemType: type,
          occurrenceKey,
          collectionName: collection,
        };
      case 'link':
        return undefined;
      case 'external':
        return {
          id: id!,
          mediaItemType: 'file',
          occurrenceKey,
          collectionName: collection,
        };
    }
  }
}
