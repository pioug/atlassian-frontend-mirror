import React from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEventHandler,
} from '@atlaskit/analytics-next';
import { ListenerProps, FabricChannel } from '../types';

import { handleEvent } from './handle-event';

/**
 * The TWP Fabric Editor is registered as a Platform Team.
 *
 * When the editor is consumed by products (e.g. Confluence, Jira, etc) it retains
 * their `product` name, and augments 'editor' as a `tag`.
 *
 * This configuration allows us to register events in Data Portal in a product agnostic way,
 * (avoiding duplicated events per product) and receive and filter events per product within Amplitude.
 *
 * @see https://data-portal.us-east-1.prod.public.atl-paas.net/
 * @see https://bitbucket.org/atlassian/events-catalog-service/src/master/src/main/java/com/atlassian/dataservices/eventcatalog/product/ProductService.java
 */
export const EDITOR_TAG = 'editor';

// @deprecated ED-9043 Can be safely removed once all editor products consume a release that uses the new tag.
export const LEGACY_EDITOR_TAG = 'fabricEditor';

export default class FabricEditorListener extends React.Component<
  ListenerProps
> {
  handleEventWrapper: UIAnalyticsEventHandler = (event) => {
    handleEvent(
      event,
      [EDITOR_TAG, LEGACY_EDITOR_TAG],
      this.props.logger,
      this.props.client,
    );
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.handleEventWrapper}
        channel={FabricChannel.editor}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
