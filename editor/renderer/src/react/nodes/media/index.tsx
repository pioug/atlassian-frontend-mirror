/** @jsx jsx */
import type { SyntheticEvent } from 'react';
import React, { PureComponent, Fragment } from 'react';
import { jsx } from '@emotion/react';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { MediaBorderGapFiller } from '@atlaskit/editor-common/ui';
import type { MediaCardProps, MediaProvider } from '../../../ui/MediaCard';
import { MediaCard } from '../../../ui/MediaCard';
import type {
  LinkDefinition,
  BorderMarkDefinition,
  AnnotationMarkDefinition,
} from '@atlaskit/adf-schema';
import type { MediaFeatureFlags } from '@atlaskit/media-common';
import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';

import { getEventHandler } from '../../../utils';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import type { AnalyticsEventPayload } from '../../../analytics/events';
import { MODE, PLATFORM } from '../../../analytics/events';
import AnnotationComponent from '../../marks/annotation';
import { linkStyle, borderStyle } from './styles';

export type MediaProps = MediaCardProps & {
  providers?: ProviderFactory;
  allowAltTextOnImages?: boolean;
  children?: React.ReactNode;
  isInsideOfBlockNode?: boolean;
  marks: Array<
    LinkDefinition | BorderMarkDefinition | AnnotationMarkDefinition
  >;
  isBorderMark: () => boolean;
  isLinkMark: () => boolean;
  isAnnotationMark?: () => boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  featureFlags?: MediaFeatureFlags;
  eventHandlers?: EventHandlers;
  enableDownloadButton?: boolean;
};

type Providers = {
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
};

const MediaBorder = ({
  mark,
  children,
}: React.PropsWithChildren<{
  mark?: BorderMarkDefinition;
}>): JSX.Element => {
  if (!mark) {
    return <Fragment>{children}</Fragment>;
  }

  const borderColor = mark?.attrs.color ?? '';
  const borderWidth = mark?.attrs.size ?? 0;

  const paletteColorValue =
    hexToEditorBorderPaletteColor(borderColor) || borderColor;

  return (
    <div
      data-mark-type="border"
      data-color={borderColor}
      data-size={borderWidth}
      css={borderStyle(paletteColorValue, borderWidth)}
    >
      <MediaBorderGapFiller borderColor={borderColor} />
      {children}
    </div>
  );
};

const MediaLink = ({
  mark,
  children,
  onClick,
}: React.PropsWithChildren<{
  mark?: LinkDefinition;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}>): JSX.Element => {
  if (!mark) {
    return <Fragment>{children}</Fragment>;
  }

  const linkHref = mark?.attrs.href;

  return (
    <a
      href={linkHref}
      rel="noreferrer noopener"
      onClick={onClick}
      data-block-link={linkHref}
      css={linkStyle}
    >
      {children}
    </a>
  );
};

const MediaAnnotation = ({
  mark,
  children,
}: React.PropsWithChildren<{
  mark?: AnnotationMarkDefinition;
}>): JSX.Element => {
  if (!mark) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <AnnotationComponent
      id={mark.attrs.id}
      annotationType={mark.attrs.annotationType}
      dataAttributes={{
        'data-renderer-mark': true,
      }}
      // This should be fine being empty [] since the serializer serializeFragmentChild getMarkProps call always passes
      annotationParentIds={[]}
      allowAnnotations
      useBlockLevel
    >
      {children}
    </AnnotationComponent>
  );
};

export default class Media extends PureComponent<MediaProps, {}> {
  constructor(props: MediaProps) {
    super(props);
    this.handleMediaLinkClickFn = this.handleMediaLinkClick.bind(this);
  }

  private handleMediaLinkClickFn;

  private renderCard = (providers: Providers = {}) => {
    const { contextIdentifierProvider } = providers;
    const {
      allowAltTextOnImages,
      alt,
      featureFlags,
      shouldOpenMediaViewer: allowMediaViewer,
      enableDownloadButton,
      ssr,
    } = this.props;

    const annotationMark = (
      this.props.isAnnotationMark
        ? this.props.marks.find(this.props.isAnnotationMark)
        : undefined
    ) as AnnotationMarkDefinition | undefined;

    const borderMark = this.props.marks.find(this.props.isBorderMark) as
      | BorderMarkDefinition
      | undefined;

    const linkMark = this.props.marks.find(this.props.isLinkMark) as
      | LinkDefinition
      | undefined;

    const linkHref = linkMark?.attrs.href;
    const eventHandlers = linkHref ? undefined : this.props.eventHandlers;
    const shouldOpenMediaViewer = !linkHref && allowMediaViewer;

    return (
      <MediaLink mark={linkMark} onClick={this.handleMediaLinkClickFn}>
        <MediaAnnotation mark={annotationMark}>
          <MediaBorder mark={borderMark}>
            <AnalyticsContext
              data={{
                [MEDIA_CONTEXT]: {
                  border: !!borderMark,
                },
              }}
            >
              <MediaCard
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
          </MediaBorder>
        </MediaAnnotation>
      </MediaLink>
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
