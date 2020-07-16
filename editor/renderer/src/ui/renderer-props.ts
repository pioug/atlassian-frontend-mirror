import { Schema } from 'prosemirror-model';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import {
  ADFStage,
  ProviderFactory,
  EventHandlers,
  ExtensionHandlers,
  AnnotationProviders,
} from '@atlaskit/editor-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { RendererContext } from '../';
import { RenderOutputStat } from '../render-document';
import {
  RendererAppearance,
  StickyHeaderProps,
  HeadingAnchorLinksProps,
} from './Renderer/types';

export interface RendererProps {
  document: any;
  dataProviders?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  // Enables inline scripts to add support for breakout nodes,
  // before main JavaScript bundle is available.
  enableSsrInlineScripts?: boolean;
  onComplete?: (stat: RenderOutputStat) => void;
  onError?: (error: any) => void;
  portal?: HTMLElement;
  rendererContext?: RendererContext;
  schema?: Schema;
  appearance?: RendererAppearance;
  adfStage?: ADFStage;
  disableHeadingIDs?: boolean;
  disableActions?: boolean;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  maxHeight?: number;
  fadeOutHeight?: number;
  truncated?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  allowColumnSorting?: boolean;
  shouldOpenMediaViewer?: boolean;
  allowAltTextOnImages?: boolean;
  stickyHeaders?: StickyHeaderProps;
  media?: {
    allowLinking?: boolean;
  };
  allowAnnotations?: boolean;
  annotationProvider?: AnnotationProviders<AnnotationMarkStates> | null;
  innerRef?: React.RefObject<HTMLDivElement>;
}
