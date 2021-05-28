import {
  MediaADFAttrs,
  RichMediaLayout as MediaSingleLayout,
} from '@atlaskit/adf-schema';
import {
  EventHandlers,
  ImageLoaderProps,
  mapBreakpointToLayoutMaxWidth,
  WidthConsumer,
} from '@atlaskit/editor-common';
import {
  akEditorFullWidthLayoutWidth,
  getAkEditorFullPageMaxWidth,
  akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles';

import { Component, default as React, ReactElement } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { AnalyticsEventPayload } from '../../../analytics/events';
import { FullPagePadding } from '../../../ui/Renderer/style';
import { RendererAppearance } from '../../../ui/Renderer/types';
import { MediaProps } from '../media';
import { ExtendedUIMediaSingle } from './styles';
import { MediaFeatureFlags, getMediaFeatureFlag } from '@atlaskit/media-common';

export interface Props {
  children: React.ReactNode;
  layout: MediaSingleLayout;
  eventHandlers?: EventHandlers;
  width?: number;
  allowDynamicTextSizing?: boolean;
  isInsideOfBlockNode?: boolean;
  rendererAppearance: RendererAppearance;
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
  if (media && !isMediaElement(media) && (media as any).props.children) {
    return checkForMediaElement((media as any).props.children);
  }
  return media as ReactElement<MediaProps & MediaADFAttrs>;
};

// returns the existing container width if available (non SSR mode), otherwise
// we return a default width value
export const getMediaContainerWidth = (
  currentContainerWidth: number,
  layout: MediaSingleLayout,
): number => {
  return !currentContainerWidth && layout !== 'full-width' && layout !== 'wide'
    ? akEditorDefaultLayoutWidth
    : currentContainerWidth;
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

  private isCaptionsFlaggedOn = getMediaFeatureFlag(
    'captions',
    this.props.featureFlags,
  );

  render() {
    const { props } = this;

    let media: ReactElement<MediaProps & MediaADFAttrs>;
    const [node, caption] = React.Children.toArray(props.children);

    if (!isMediaElement(node)) {
      const mediaElement = checkForMediaElement((node as any).props.children);
      if (!mediaElement) {
        return node as React.ReactElement<MediaProps>;
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

    // TODO: put appearance-based padding into theme instead
    const { rendererAppearance, featureFlags } = this.props;

    const padding =
      rendererAppearance === 'full-page' ? FullPagePadding * 2 : 0;

    return (
      <WidthConsumer>
        {({ width: widthConsumerValue, breakpoint }) => {
          const containerWidth = getMediaContainerWidth(
            widthConsumerValue,
            props.layout,
          );
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

          const mediaComponent = React.cloneElement(media, {
            resizeMode: 'stretchy-fit',
            cardDimensions,
            originalDimensions,
            onExternalImageLoaded: this.onExternalImageLoaded,
            disableOverlay: true,
            featureFlags: featureFlags,
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
            >
              <>{mediaComponent}</>
              {this.isCaptionsFlaggedOn && caption}
            </ExtendedUIMediaSingle>
          );
        }}
      </WidthConsumer>
    );
  }
}

export default injectIntl(MediaSingle);
