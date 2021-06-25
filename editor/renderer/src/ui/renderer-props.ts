import { Schema } from 'prosemirror-model';
import {
  ADFStage,
  ProviderFactory,
  EventHandlers,
  ExtensionHandlers,
  AnnotationProviders,
  UnsupportedContentLevelsTracking,
} from '@atlaskit/editor-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { RendererContext } from '../';
import { RenderOutputStat } from '../render-document';
import {
  RendererAppearance,
  StickyHeaderProps,
  HeadingAnchorLinksProps,
} from './Renderer/types';
import { MediaOptions } from '../types/mediaOptions';

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
  allowPlaceholderText?: boolean;
  maxHeight?: number;
  fadeOutHeight?: number;
  truncated?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  allowColumnSorting?: boolean;
  shouldOpenMediaViewer?: boolean;
  allowAltTextOnImages?: boolean;
  stickyHeaders?: StickyHeaderProps;
  media?: MediaOptions;
  allowAnnotations?: boolean;
  annotationProvider?: AnnotationProviders | null;
  innerRef?: React.RefObject<HTMLDivElement>;
  useSpecBasedValidator?: boolean;
  allowCopyToClipboard?: boolean;
  UNSAFE_allowCustomPanels?: boolean;
  analyticsEventSeverityTracking?: {
    enabled: boolean;
    severityNormalThreshold: number;
    severityDegradedThreshold: number;
  };
  allowUgcScrubber?: boolean;
  allowSelectAllTrap?: boolean;
  unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking;

  /**
   * @default undefined
   * @description
   * Short lived feature flags for experiments and gradual rollouts
   * Flags are expected to follow these rules or they are filtered out
   *
   * 1. cased in kebab-case (match [a-z-])
   * 2. have boolean values
   *
   * @example
   * ```tsx
   * (<Renderer featureFlags={{ 'my-feature': true }} />);
   * getFeatureFlags()?.myFeature === true;
   * ```
   *
   * @example
   * ```tsx
   * (<Renderer featureFlags={{ 'my-feature': 'thing' }} />);
   * getFeatureFlags()?.myFeature === undefined;
   * ```
   *
   * @example
   * ```tsx
   * (<Renderer featureFlags={{ 'product.my-feature': false }} />);
   * getFeatureFlags()?.myFeature === undefined;
   * getFeatureFlags()?.productMyFeature === undefined;
   * ```
   */
  featureFlags?: { [featureFlag: string]: boolean };
}
