import {
  LinkDefinition,
  MediaADFAttrs,
  RichMediaLayout as MediaSingleLayout,
} from '@atlaskit/adf-schema';
import {
  EventHandlers,
  ImageLoaderProps,
  mapBreakpointToLayoutMaxWidth,
  MediaLink,
  WidthConsumer,
} from '@atlaskit/editor-common';
import {
  akEditorFullWidthLayoutWidth,
  getAkEditorFullPageMaxWidth,
} from '@atlaskit/editor-shared-styles';

import {
  Component,
  default as React,
  ReactElement,
  SyntheticEvent,
} from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../../analytics/enums';
import {
  AnalyticsEventPayload,
  MODE,
  PLATFORM,
} from '../../../analytics/events';
import { FullPagePadding } from '../../../ui/Renderer/style';
import { RendererAppearance } from '../../../ui/Renderer/types';
import { getEventHandler } from '../../../utils';
import { MediaProps } from '../media';
import { ExtendedUIMediaSingle } from './styles';
import { MediaFeatureFlags } from '@atlaskit/media-common';

export interface Props {
  children: React.ReactNode;
  layout: MediaSingleLayout;
  eventHandlers?: EventHandlers;
  width?: number;
  allowDynamicTextSizing?: boolean;
  isInsideOfBlockNode?: boolean;
  rendererAppearance: RendererAppearance;
  marks: Array<LinkDefinition>;
  isLinkMark: () => boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  featureFlags?: MediaFeatureFlags;
}

export interface State {
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

const isMediaElement = (
  media: React.ReactNode,
): media is ReactElement<MediaProps & MediaADFAttrs> => {
  if (!media) {
    return false;
  }

  const { nodeType, type } = (media as any).props || {};

  // Use this to perform a rough check
  // better than assume the first item in children is media
  return (
    nodeType === 'media' || ['external', 'file', 'link'].indexOf(type) >= 0
  );
};

const checkForMediaElement = (
  children: React.ReactNode,
): ReactElement<MediaProps & MediaADFAttrs> => {
  const [media] = React.Children.toArray(children);
  if (!isMediaElement(media) && (media as any).props.children) {
    return checkForMediaElement((media as any).props.children);
  }
  return media as ReactElement<MediaProps & MediaADFAttrs>;
};

class MediaSingle extends Component<Props & InjectedIntlProps, State> {
  constructor(props: Props & InjectedIntlProps) {
    super(props);
    this.state = {}; // Need to initialize with empty state.
  }

  private onExternalImageLoaded = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    this.setState({
      width,
      height,
    });
  };

  private handleMediaLinkClick = (
    event: SyntheticEvent<HTMLAnchorElement, Event>,
  ) => {
    const { fireAnalyticsEvent, eventHandlers, isLinkMark, marks } = this.props;
    if (fireAnalyticsEvent) {
      fireAnalyticsEvent({
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
        actionSubjectId: ACTION_SUBJECT_ID.MEDIA_LINK,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          platform: PLATFORM.WEB,
          mode: MODE.RENDERER,
        },
      });
    }

    const handler = getEventHandler(eventHandlers, 'link');
    if (handler) {
      const linkMark = marks.find(isLinkMark);
      handler(event, linkMark && linkMark.attrs.href);
    }
  };

  private isCaptionsFlaggedOn =
    this.props.featureFlags && this.props.featureFlags.captions;

  render() {
    const { props } = this;

    let media: ReactElement<MediaProps & MediaADFAttrs>;
    const [node, caption] = React.Children.toArray(props.children);

    if (!isMediaElement(node)) {
      const mediaElement = checkForMediaElement((node as any).props.children);
      if (!mediaElement) {
        return null;
      }
      media = mediaElement;
    } else {
      media = node;
    }

    let { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, type } = media.props;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;
      if (width === null) {
        width = stateWidth || DEFAULT_WIDTH;
      }
      if (height === null) {
        height = stateHeight || DEFAULT_HEIGHT;
      }
    }

    if (width === null) {
      width = DEFAULT_WIDTH;
      height = DEFAULT_HEIGHT;
    }

    const linkMark = props.marks.find(props.isLinkMark);

    // TODO: put appearance-based padding into theme instead
    const { rendererAppearance, featureFlags } = this.props;

    const padding =
      rendererAppearance === 'full-page' ? FullPagePadding * 2 : 0;

    return (
      <WidthConsumer>
        {({ width: containerWidth, breakpoint }) => {
          const { isInsideOfBlockNode, allowDynamicTextSizing } = this.props;
          const maxWidth = containerWidth;
          const maxHeight = (height / width) * maxWidth;
          const cardDimensions = {
            width: `${maxWidth}px`,
            height: `${maxHeight}px`,
          };

          const isFullWidth = rendererAppearance === 'full-width';

          let nonFullWidthSize = containerWidth;
          if (!isInsideOfBlockNode && rendererAppearance !== 'comment') {
            const isContainerSizeGreaterThanMaxFullPageWidth =
              containerWidth - padding >=
              getAkEditorFullPageMaxWidth(allowDynamicTextSizing);

            if (
              isContainerSizeGreaterThanMaxFullPageWidth &&
              allowDynamicTextSizing
            ) {
              nonFullWidthSize = mapBreakpointToLayoutMaxWidth(breakpoint);
            } else if (isContainerSizeGreaterThanMaxFullPageWidth) {
              nonFullWidthSize = getAkEditorFullPageMaxWidth(
                allowDynamicTextSizing,
              );
            } else {
              nonFullWidthSize = containerWidth - padding;
            }
          }

          const lineLength = isFullWidth
            ? Math.min(akEditorFullWidthLayoutWidth, containerWidth - padding)
            : nonFullWidthSize;
          const originalDimensions = {
            height,
            width,
          };

          const linkHref = linkMark?.attrs.href;
          // We ignore all the event handlers when a link exists
          const eventHandlers = linkHref
            ? undefined
            : media.props.eventHandlers;

          // We should not open media viewer when there is a link
          const shouldOpenMediaViewer =
            !linkHref && media.props.shouldOpenMediaViewer;

          const mediaComponent = React.cloneElement(media, {
            resizeMode: 'stretchy-fit',
            cardDimensions,
            originalDimensions,
            onExternalImageLoaded: this.onExternalImageLoaded,
            disableOverlay: true,
            featureFlags: featureFlags,
            shouldOpenMediaViewer,
            eventHandlers,
          } as MediaProps & ImageLoaderProps);

          return (
            <ExtendedUIMediaSingle
              layout={props.layout}
              width={width}
              height={height}
              lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
              containerWidth={containerWidth}
              pctWidth={props.width}
              fullWidthMode={isFullWidth}
              blockLink={linkHref}
            >
              <>
                {linkHref ? (
                  <MediaLink
                    href={linkHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={this.handleMediaLinkClick}
                  >
                    <>{mediaComponent}</>
                  </MediaLink>
                ) : (
                  <>{mediaComponent}</>
                )}
                {this.isCaptionsFlaggedOn && caption}
              </>
            </ExtendedUIMediaSingle>
          );
        }}
      </WidthConsumer>
    );
  }
}

export default injectIntl(MediaSingle);
