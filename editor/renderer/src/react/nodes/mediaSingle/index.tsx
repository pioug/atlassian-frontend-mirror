/** @jsx jsx */
import type { ReactElement } from 'react';
import {
  default as React,
  Fragment,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type {
  MediaADFAttrs,
  RichMediaLayout as MediaSingleLayout,
} from '@atlaskit/adf-schema';

import type { MediaFeatureFlags } from '@atlaskit/media-common';
import {
  MediaSingle as UIMediaSingle,
  WidthContext,
} from '@atlaskit/editor-common/ui';
import type {
  EventHandlers,
  MediaSingleWidthType,
} from '@atlaskit/editor-common/ui';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import {
  akEditorFullWidthLayoutWidth,
  akEditorDefaultLayoutWidth,
  akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import type { AnalyticsEventPayload } from '../../../analytics/events';
import { FullPagePadding } from '../../../ui/Renderer/style';
import type { RendererAppearance } from '../../../ui/Renderer/types';
import type { MediaProps } from '../media';
import { uiMediaSingleBaseStyles, uiMediaSingleLayoutStyles } from './styles';

export interface Props {
  children: React.ReactNode;
  layout: MediaSingleLayout;
  eventHandlers?: EventHandlers;
  width?: number;
  widthType?: MediaSingleWidthType;
  isInsideOfBlockNode?: boolean;
  rendererAppearance: RendererAppearance;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  featureFlags?: MediaFeatureFlags;
  allowCaptions?: boolean;
  isInsideOfInlineExtension?: boolean;
  dataAttributes?: Record<string, any>;
}

interface ChildElements {
  media: ReactElement<MediaProps & MediaADFAttrs>;
  caption: React.ReactNode;
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
  if (!currentContainerWidth) {
    // SSR mode fallback to default layout width
    switch (layout) {
      case 'full-width':
        return akEditorFullWidthLayoutWidth;
      case 'wide':
        return akEditorWideLayoutWidth;
      default:
        return akEditorDefaultLayoutWidth;
    }
  }
  return currentContainerWidth;
};

const MediaSingleWithChildren = (
  props: Props & ChildElements & WrappedComponentProps,
) => {
  const {
    rendererAppearance,
    featureFlags,
    isInsideOfBlockNode,
    layout,
    width: widthAttr,
    widthType,
    allowCaptions = false,
    isInsideOfInlineExtension = false,
    dataAttributes,
    media,
    caption,
  } = props;

  const [externalImageDimensions, setExternalImageDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const ref = React.useRef<HTMLDivElement>(null);
  const onExternalImageLoaded = React.useCallback(
    ({ width, height }: { width: number; height: number }) => {
      setExternalImageDimensions({
        width,
        height,
      });
    },
    [],
  );

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

  const calcDimensions = useCallback(
    (mediaContainerWidth: number) => {
      const containerWidth = getMediaContainerWidth(
        mediaContainerWidth,
        layout,
      );

      const maxWidth = containerWidth;
      const maxHeight = (height / width) * maxWidth;
      const cardDimensions = {
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
      };
      let nonFullWidthSize = containerWidth;
      if (!isInsideOfBlockNode && rendererAppearance !== 'comment') {
        const isContainerSizeGreaterThanMaxFullPageWidth =
          containerWidth - padding >= akEditorDefaultLayoutWidth;

        if (isContainerSizeGreaterThanMaxFullPageWidth) {
          nonFullWidthSize = akEditorDefaultLayoutWidth;
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
      };
    },
    [
      height,
      isFullWidth,
      isInsideOfBlockNode,
      layout,
      padding,
      rendererAppearance,
      width,
    ],
  );

  const originalDimensions = useMemo(
    () => ({ width, height }),
    [height, width],
  );

  // Note: in SSR mode the `window` object is not defined,
  // therefore width here is 0, see:
  // packages/editor/editor-common/src/ui/WidthProvider/index.tsx
  const { width: renderWidth } = useContext(WidthContext);
  const containerWidth = getMediaContainerWidth(renderWidth, layout);
  const { cardDimensions, lineLength } = useMemo(
    () => calcDimensions(containerWidth),
    [calcDimensions, containerWidth],
  );

  const renderMediaSingle = () => {
    const mediaComponent = React.cloneElement(media, {
      resizeMode: 'stretchy-fit',
      cardDimensions,
      originalDimensions,
      onExternalImageLoaded,
      disableOverlay: true,
      featureFlags,
      mediaSingleElement: ref.current,
    } as MediaProps & ImageLoaderProps);

    const uiMediaSingleStyles =
      layout === 'full-width' || layout === 'wide'
        ? [uiMediaSingleBaseStyles, uiMediaSingleLayoutStyles]
        : [uiMediaSingleBaseStyles];

    return (
      <UIMediaSingle
        css={uiMediaSingleStyles}
        handleMediaSingleRef={ref}
        layout={layout}
        width={width}
        height={height}
        lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
        containerWidth={containerWidth}
        size={{
          width: widthAttr,
          widthType,
        }}
        fullWidthMode={isFullWidth}
        isInsideOfInlineExtension={isInsideOfInlineExtension}
        dataAttributes={dataAttributes}
      >
        <Fragment>{mediaComponent}</Fragment>
        {allowCaptions && caption}
      </UIMediaSingle>
    );
  };

  return renderMediaSingle();
};

const MediaSingle = (props: Props & WrappedComponentProps) => {
  const { children } = props;
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
  return <MediaSingleWithChildren {...props} media={media} caption={caption} />;
};

export default injectIntl(MediaSingle);
