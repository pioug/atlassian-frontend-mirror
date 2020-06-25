import React, { SyntheticEvent, Component, ReactElement } from 'react';
import styled from 'styled-components';
import {
  RichMediaLayout as MediaSingleLayout,
  MediaADFAttrs,
} from '@atlaskit/adf-schema';
import { Mark } from 'prosemirror-model';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Tooltip from '@atlaskit/tooltip';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import {
  MediaSingle as UIMediaSingle,
  WidthConsumer,
  MediaLink,
  MediaLinkWrapper,
  getAkEditorFullPageMaxWidth,
  mapBreakpointToLayoutMaxWidth,
  ImageLoaderProps,
  akEditorFullWidthLayoutWidth,
  linkMessages,
  EventHandlers,
} from '@atlaskit/editor-common';
import { FullPagePadding } from '../../ui/Renderer/style';
import { RendererAppearance } from '../../ui/Renderer/types';
import { MediaProps } from './media';

import { AnalyticsEventPayload, PLATFORM, MODE } from '../../analytics/events';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../analytics/enums';
import { getEventHandler } from '../../utils';

export interface Props {
  children: ReactElement<any>;
  layout: MediaSingleLayout;
  eventHandlers?: EventHandlers;
  width?: number;
  allowDynamicTextSizing?: boolean;
  isInsideOfBlockNode?: boolean;
  rendererAppearance: RendererAppearance;
  marks: Mark[];
  isLinkMark: () => boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
}

export interface State {
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

const AkEditorMediaLinkClassName = 'ak-editor-media-link';
const ExtendedUIMediaSingle = styled(UIMediaSingle)`
  .${AkEditorMediaLinkClassName} {
    align-items: center;
    justify-content: center;
  }

  /* web */
  @media (any-hover: hover) {
    .${AkEditorMediaLinkClassName} {
      width: 20px;
      height: 20px;

      /* ShortcutIcon */
      span[role='img'] {
        width: initial;
        height: initial;

        > svg {
          width: 24px;
          height: 24px;
        }
      }
    }

    &:not(:hover) {
      .${AkEditorMediaLinkClassName} {
        opacity: 0;
      }
    }

    &:focus-within {
      .${AkEditorMediaLinkClassName} {
        opacity: 1;
      }
    }
  }
  /* mobile */
  @media (pointer: none) {
    .${AkEditorMediaLinkClassName} {
      width: 36px;
      height: 36px;
    }
  }

  ${({ layout }) =>
    layout === 'full-width' || layout === 'wide'
      ? `
  margin-left: 50%;
  transform: translateX(-50%);
  `
      : ``} transition: all 0.1s linear;
`;

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

  render() {
    const { props } = this;

    const child = React.Children.only(
      React.Children.toArray<React.ReactElement>(props.children)[0],
    );

    let {
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      type,
    } = child.props as MediaADFAttrs;

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
          const cardWidth = containerWidth;
          const cardHeight = (height / width) * cardWidth;
          const cardDimensions = {
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
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
              <>
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
                {React.cloneElement(child, {
                  resizeMode: 'stretchy-fit',
                  cardDimensions,
                  originalDimensions,
                  onExternalImageLoaded: this.onExternalImageLoaded,
                  disableOverlay: true,
                } as MediaProps & ImageLoaderProps)}
              </>
            </ExtendedUIMediaSingle>
          );
        }}
      </WidthConsumer>
    );
  }
}

export default injectIntl(MediaSingle);
