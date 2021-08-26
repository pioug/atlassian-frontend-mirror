import React from 'react';
import {
  MediaClient,
  FileIdentifier,
  Identifier,
  isFileIdentifier,
  isExternalImageIdentifier,
  MediaCollectionItem,
} from '@atlaskit/media-client';
import { Outcome } from './domain';
import ErrorMessage from './errorMessage';
import { List } from './list';
import { Subscription } from 'rxjs/Subscription';
import { toIdentifier } from './utils';
import { Spinner } from './loading';
import { WithShowControlMethodProp } from '@atlaskit/media-ui';
import { MediaViewerExtensions } from './components/types';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { MediaViewerError } from './errors';

export type Props = Readonly<
  {
    onClose?: () => void;
    defaultSelectedItem?: Identifier;
    collectionName: string;
    mediaClient: MediaClient;
    pageSize: number;
    onNavigationChange?: (selectedItem: Identifier) => void;
    extensions?: MediaViewerExtensions;
    onSidebarButtonClick?: () => void;
    featureFlags?: MediaFeatureFlags;
  } & WithShowControlMethodProp
>;

export type State = {
  items: Outcome<MediaCollectionItem[], MediaViewerError>;
  item?: Identifier;
};

const initialState: State = {
  items: Outcome.pending(),
};

export class Collection extends React.Component<Props, State> {
  state: State = initialState;

  private subscription?: Subscription;

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  componentDidMount() {
    this.init(this.props);
  }

  render() {
    const {
      defaultSelectedItem,
      mediaClient,
      onClose,
      collectionName,
      showControls,
      extensions,
      onSidebarButtonClick,
      featureFlags,
    } = this.props;

    return this.state.items.match({
      pending: () => <Spinner />,
      successful: (items) => {
        const identifiers = items.map((x) => toIdentifier(x, collectionName));
        const item = defaultSelectedItem
          ? { ...defaultSelectedItem, collectionName }
          : identifiers[0];

        return (
          <List
            items={identifiers}
            defaultSelectedItem={item}
            mediaClient={mediaClient}
            onClose={onClose}
            onNavigationChange={this.onNavigationChange}
            showControls={showControls}
            extensions={extensions}
            onSidebarButtonClick={onSidebarButtonClick}
            featureFlags={featureFlags}
          />
        );
      },
      failed: (error) => {
        const { item } = this.state;
        return (
          <ErrorMessage
            fileId={item && isFileIdentifier(item) ? item.id : 'undefined'}
            error={error}
          />
        );
      },
    });
  }

  private init(props: Props) {
    this.setState(initialState);
    const {
      collectionName,
      mediaClient,
      defaultSelectedItem,
      pageSize,
    } = props;
    this.subscription = mediaClient.collection
      .getItems(collectionName, { limit: pageSize })
      .subscribe({
        next: (items) => {
          this.setState({
            items: Outcome.successful(items),
          });
          if (defaultSelectedItem && this.shouldLoadNext(defaultSelectedItem)) {
            mediaClient.collection.loadNextPage(collectionName, {
              limit: pageSize,
            });
          }
        },
        error: (error: Error) => {
          this.setState({
            items: Outcome.failed(
              new MediaViewerError('collection-fetch-metadata', error),
            ),
          });
        },
      });
  }

  private release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private needsReset(propsA: Props, propsB: Props) {
    return (
      propsA.collectionName !== propsB.collectionName ||
      propsA.mediaClient !== propsB.mediaClient
    );
  }

  private onNavigationChange = (item: Identifier) => {
    const {
      mediaClient,
      collectionName,
      pageSize,
      onNavigationChange,
    } = this.props;
    this.setState({ item });
    if (this.shouldLoadNext(item)) {
      mediaClient.collection.loadNextPage(collectionName, {
        limit: pageSize,
      });
    }

    if (onNavigationChange) {
      onNavigationChange(item);
    }
  };

  private shouldLoadNext(selectedItem: Identifier): boolean {
    if (isExternalImageIdentifier(selectedItem)) {
      return false;
    }
    const { items } = this.state;
    return items.match({
      pending: () => false,
      failed: () => false,
      successful: (items) =>
        items.length !== 0 && this.isLastItem(selectedItem, items),
    });
  }

  private isLastItem(
    selectedItem: FileIdentifier,
    items: MediaCollectionItem[],
  ) {
    const lastItem = items[items.length - 1];

    const isLastItem =
      selectedItem.id === lastItem.id &&
      selectedItem.occurrenceKey === lastItem.occurrenceKey;
    return isLastItem;
  }
}
