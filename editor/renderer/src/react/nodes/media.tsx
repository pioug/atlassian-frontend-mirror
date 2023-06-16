/** @jsx jsx */
import React, { SyntheticEvent } from 'react';
import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { mediaLinkStyle } from '@atlaskit/editor-common/ui';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { MediaCard, MediaCardProps, MediaProvider } from '../../ui/MediaCard';
import { LinkDefinition, BorderMarkDefinition } from '@atlaskit/adf-schema';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';

import { getEventHandler } from '../../utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import { AnalyticsEventPayload, MODE, PLATFORM } from '../../analytics/events';

export type MediaProps = MediaCardProps & {
  providers?: ProviderFactory;
  allowAltTextOnImages?: boolean;
  children?: React.ReactNode;
  isInsideOfBlockNode?: boolean;
  marks: Array<LinkDefinition | BorderMarkDefinition>;
  isBorderMark: () => boolean;
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
      ssr,
    } = this.props;

    const borderMark = this.props.marks.find(
      this.props.isBorderMark,
    ) as BorderMarkDefinition;
    const borderColor = borderMark?.attrs.color ?? '';
    const borderWidth = borderMark?.attrs.size ?? 0;

    const linkMark = this.props.marks.find(
      this.props.isLinkMark,
    ) as LinkDefinition;
    const linkHref = linkMark?.attrs.href;
    const eventHandlers = linkHref ? undefined : this.props.eventHandlers;
    const shouldOpenMediaViewer = !linkHref && allowMediaViewer;
    const mediaComponent = (
      <AnalyticsContext
        data={{
          [MEDIA_CONTEXT]: {
            border: !!borderMark,
          },
        }}
      >
        <MediaCard
          mediaProvider={mediaProvider}
          contextIdentifierProvider={contextIdentifierProvider}
          {...this.props}
          shouldOpenMediaViewer={shouldOpenMediaViewer}
          eventHandlers={eventHandlers}
          alt={allowAltTextOnImages ? alt : undefined}
          featureFlags={featureFlags}
          shouldEnableDownloadButton={enableDownloadButton}
          ssr={ssr}
        />
      </AnalyticsContext>
    );

    const paletteColorValue =
      hexToEditorBorderPaletteColor(borderColor) || borderColor;

    const mediaComponentWithBorder = borderMark ? (
      <div
        data-mark-type="border"
        data-color={borderColor}
        data-size={borderWidth}
        style={{
          width: '100%',
          height: '100%',
          borderColor: paletteColorValue,
          borderWidth: `${borderWidth}px`,
          borderStyle: 'solid',
          borderRadius: `${borderWidth * 2}px`,
        }}
      >
        {mediaComponent}
      </div>
    ) : (
      mediaComponent
    );

    return linkHref ? (
      <a
        href={linkHref}
        rel="noreferrer noopener"
        onClick={this.handleMediaLinkClick}
        data-block-link={linkHref}
        css={mediaLinkStyle}
      >
        {mediaComponentWithBorder}
      </a>
    ) : (
      mediaComponentWithBorder
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
    const linkMark = this.props.marks.find(
      this.props.isLinkMark,
    ) as LinkDefinition;
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
