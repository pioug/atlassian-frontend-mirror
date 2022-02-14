import { default as React, ReactElement } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import {
  MediaADFAttrs,
  RichMediaLayout as MediaSingleLayout,
} from '@atlaskit/adf-schema';
import { MediaFeatureFlags, getMediaFeatureFlag } from '@atlaskit/media-common';
import {
  mapBreakpointToLayoutMaxWidth,
  getBreakpoint,
  WidthConsumer,
} from '@atlaskit/editor-common/ui';
import type { EventHandlers, Breakpoints } from '@atlaskit/editor-common/ui';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import {
  akEditorFullWidthLayoutWidth,
  getAkEditorFullPageMaxWidth,
  akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { AnalyticsEventPayload } from '../../../analytics/events';
import { FullPagePadding } from '../../../ui/Renderer/style';
import { RendererAppearance } from '../../../ui/Renderer/types';
import { useObservedWidth } from '../../hooks/use-observed-width';
import { MediaProps } from '../media';
import { ExtendedUIMediaSingle } from './styles';

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

const MediaSingle = (props: Props & WrappedComponentProps) => {
  const {
    rendererAppearance,
    featureFlags,
    isInsideOfBlockNode,
    allowDynamicTextSizing,
    layout,
    children,
    width: pctWidth,
  } = props;
  const isCaptionsFlaggedOn = getMediaFeatureFlag('captions', featureFlags);
  const [externalImageDimensions, setExternalImageDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const ref = React.useRef<HTMLElement>(null);
  const onExternalImageLoaded = React.useCallback(
    ({ width, height }: { width: number; height: number }) => {
      setExternalImageDimensions({
        width,
        height,
      });
    },
    [],
  );

  const observedWidthFlag = getMediaFeatureFlag('observedWidth', featureFlags);

  const { width: observedWidth } = useObservedWidth(
    ref.current?.parentElement,
    observedWidthFlag,
  );

  let media: ReactElement<MediaProps & MediaADFAttrs>;
  const [node, caption] = React.Children.toArray(children);

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
    const { width: stateWidth, height: stateHeight } = externalImageDimensions;
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

  const padding = rendererAppearance === 'full-page' ? FullPagePadding * 2 : 0;
  const isFullWidth = rendererAppearance === 'full-width';

  const calcDimensions = (
    mediaContainerWidth: number,
    mediaBreakpoint?: Breakpoints,
  ) => {
    const containerWidth = getMediaContainerWidth(mediaContainerWidth, layout);
    const breakpoint = mediaBreakpoint || getBreakpoint(containerWidth);
    const maxWidth = containerWidth;
    const maxHeight = (height / width) * maxWidth;
    const cardDimensions = {
      width: `${maxWidth}px`,
      height: `${maxHeight}px`,
    };
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
        nonFullWidthSize = getAkEditorFullPageMaxWidth(allowDynamicTextSizing);
      } else {
        nonFullWidthSize = containerWidth - padding;
      }
    }
    const minWidth = Math.min(
      akEditorFullWidthLayoutWidth,
      containerWidth - padding,
    );

    const lineLength = isFullWidth ? minWidth : nonFullWidthSize;
    return {
      cardDimensions,
      lineLength,
      containerWidth,
    };
  };

  const originalDimensions = {
    height,
    width,
  };

  const renderMediaSingle = (
    renderWidth: number,
    mediaBreakpoint?: Breakpoints,
  ) => {
    const { cardDimensions, lineLength, containerWidth } = calcDimensions(
      renderWidth,
      mediaBreakpoint,
    );
    const mediaComponent = React.cloneElement(media, {
      resizeMode: 'stretchy-fit',
      cardDimensions,
      originalDimensions,
      onExternalImageLoaded,
      disableOverlay: true,
      featureFlags,
    } as MediaProps & ImageLoaderProps);

    return (
      <ExtendedUIMediaSingle
        handleMediaSingleRef={ref}
        layout={layout}
        width={width}
        height={height}
        lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
        containerWidth={containerWidth}
        pctWidth={pctWidth}
        fullWidthMode={isFullWidth}
      >
        <>{mediaComponent}</>
        {isCaptionsFlaggedOn && caption}
      </ExtendedUIMediaSingle>
    );
  };

  return observedWidthFlag ? (
    renderMediaSingle(observedWidth || document.body.offsetWidth)
  ) : (
    <WidthConsumer>
      {({ width, breakpoint }) => {
        return renderMediaSingle(width, breakpoint);
      }}
    </WidthConsumer>
  );
};

export default injectIntl(MediaSingle);
