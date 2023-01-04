import { Schema } from 'prosemirror-model';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { RendererContext } from '../';
import { RenderOutputStat } from '../render-document';
import {
  RendererAppearance,
  StickyHeaderProps,
  HeadingAnchorLinksProps,
  NodeComponentsProps,
} from './Renderer/types';
import { MediaOptions } from '../types/mediaOptions';
import { SmartLinksOptions } from '../types/smartLinksOptions';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { DocNode } from '@atlaskit/adf-schema';

export interface RawObjectFeatureFlags {
  ['renderer-render-tracking']: string;
}

export interface NormalizedObjectFeatureFlags {
  rendererRenderTracking: {
    [ACTION_SUBJECT.RENDERER]: {
      enabled: boolean;
      useShallow: boolean;
    };
  };
}

export interface RendererProps {
  document: DocNode;
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
  emojiResourceConfig?: EmojiResourceConfig;
  smartLinks?: SmartLinksOptions;
  allowAnnotations?: boolean;
  annotationProvider?: AnnotationProviders | null;
  innerRef?: React.RefObject<HTMLDivElement>;
  useSpecBasedValidator?: boolean;
  allowCopyToClipboard?: boolean;
  allowCustomPanels?: boolean;
  analyticsEventSeverityTracking?: {
    enabled: boolean;
    severityNormalThreshold: number;
    severityDegradedThreshold: number;
  };
  allowUgcScrubber?: boolean;
  allowSelectAllTrap?: boolean;
  unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking;
  nodeComponents?: NodeComponentsProps;

  /**
   * @default undefined
   * @description
   * Short lived feature flags for experiments and gradual rollouts
   * Flags are expected to follow these rules or they are filtered out
   *
   * 1. cased in kebab-case (match [a-z-])
   * 2. have boolean values or object {} values
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
  featureFlags?:
    | { [featureFlag: string]: boolean }
    | Partial<RawObjectFeatureFlags>;
}
