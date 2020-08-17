import {
  MediaADFAttrs,
  RichMediaLayout as MediaSingleLayout,
} from '@atlaskit/adf-schema';
import {
  akEditorFullWidthLayoutWidth,
  EventHandlers,
  getAkEditorFullPageMaxWidth,
  ImageLoaderProps,
  linkMessages,
  mapBreakpointToLayoutMaxWidth,
  MediaLink,
  MediaLinkWrapper,
  WidthConsumer,
} from '@atlaskit/editor-common';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import Tooltip from '@atlaskit/tooltip';
import { Mark } from 'prosemirror-model';
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
  marks: Mark[];
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

const AkEditorMediaLinkClassName = 'ak-editor-media-link';

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

    const [media, caption] = React.Children.toArray(props.children);

    if (!media) {
      return null;
    }

    let {
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      type,
    } = (media as ReactElement).props as MediaADFAttrs;

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
    const openLinkMessage = props.intl.formatMessage(linkMessages.openLink);

    // TODO: put appearance-based padding into theme instead
    const { rendererAppearance } = this.props;

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

          return (
            <ExtendedUIMediaSingle
              layout={props.layout}
              width={width}
              height={height}
              lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
              containerWidth={containerWidth}
              pctWidth={props.width}
              fullWidthMode={isFullWidth}
              blockLink={linkMark && linkMark.attrs.href}
            >
              {linkMark && linkMark.attrs.href ? (
                <Tooltip
                  content={openLinkMessage}
                  position="top"
                  tag={MediaLinkWrapper}
                  delay={0}
                >
                  <MediaLink
                    href={linkMark.attrs.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={AkEditorMediaLinkClassName}
                    onClick={this.handleMediaLinkClick}
                  >
                    <ShortcutIcon label={linkMark.attrs.href} size="large" />
                  </MediaLink>
                </Tooltip>
              ) : null}
              {React.cloneElement(
                media as ReactElement,
                {
                  resizeMode: 'stretchy-fit',
                  cardDimensions,
                  originalDimensions,
                  onExternalImageLoaded: this.onExternalImageLoaded,
                  disableOverlay: true,
                  featureFlags: this.props.featureFlags,
                } as MediaProps & ImageLoaderProps,
              )}
              {this.isCaptionsFlaggedOn && caption}
            </ExtendedUIMediaSingle>
          );
        }}
      </WidthConsumer>
    );
  }
}

export default injectIntl(MediaSingle);
