import React, { SyntheticEvent } from 'react';
import { PureComponent } from 'react';
import {
  WithProviders,
  ContextIdentifierProvider,
  MediaLink,
  EventHandlers,
} from '@atlaskit/editor-common';
import { ProviderFactory } from '@atlaskit/editor-common';
import { MediaCard, MediaCardProps, MediaProvider } from '../../ui/MediaCard';
import { LinkDefinition } from '@atlaskit/adf-schema';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { getEventHandler } from '../../utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../analytics/enums';

import { AnalyticsEventPayload, MODE, PLATFORM } from '../../analytics/events';

export type MediaProps = MediaCardProps & {
  providers?: ProviderFactory;
  allowAltTextOnImages?: boolean;
  children?: React.ReactNode;
  allowDynamicTextSizing?: boolean;
  isInsideOfBlockNode?: boolean;
  marks: Array<LinkDefinition>;
  isLinkMark: () => boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  featureFlags?: MediaFeatureFlags;
  eventHandlers?: EventHandlers;
  enableDownloadButton?: boolean;
};

type Providers = {
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};
export default class Media extends PureComponent<MediaProps, {}> {
  private renderCard = (providers: Providers = {}) => {
    const { mediaProvider, contextIdentifierProvider } = providers;
    const {
      allowAltTextOnImages,
      alt,
      featureFlags,
      shouldOpenMediaViewer: allowMediaViewer,
      enableDownloadButton,
    } = this.props;

    const linkMark = this.props.marks.find(this.props.isLinkMark);
    const linkHref = linkMark?.attrs.href;
    const eventHandlers = linkHref ? undefined : this.props.eventHandlers;
    const shouldOpenMediaViewer = !linkHref && allowMediaViewer;
    const mediaComponent = (
      <MediaCard
        mediaProvider={mediaProvider}
        contextIdentifierProvider={contextIdentifierProvider}
        {...this.props}
        shouldOpenMediaViewer={shouldOpenMediaViewer}
        eventHandlers={eventHandlers}
        alt={allowAltTextOnImages ? alt : undefined}
        featureFlags={featureFlags}
        shouldEnableDownloadButton={enableDownloadButton}
      />
    );

    return linkHref ? (
      <MediaLink
        href={linkHref}
        rel="noreferrer noopener"
        onClick={this.handleMediaLinkClick}
        data-block-link={linkHref}
      >
        {mediaComponent}
      </MediaLink>
    ) : (
      mediaComponent
    );
  };

  private handleMediaLinkClick = (
    event: SyntheticEvent<HTMLAnchorElement, Event>,
  ) => {
    const { fireAnalyticsEvent, isLinkMark, marks } = this.props;
    if (fireAnalyticsEvent) {
      fireAnalyticsEvent({
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.LINK,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          platform: PLATFORM.WEB,
          mode: MODE.RENDERER,
        },
      });
    }
    const linkMark = this.props.marks.find(this.props.isLinkMark);
    const linkHref = linkMark?.attrs.href;

    const handler = getEventHandler(this.props.eventHandlers, 'link');
    if (handler) {
      const linkMark = marks.find(isLinkMark);
      handler(event, linkMark && linkHref);
    }
  };

  render() {
    const { providers } = this.props;

    if (!providers) {
      return this.renderCard();
    }
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providers}
        renderNode={this.renderCard}
      />
    );
  }
}
