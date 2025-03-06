import type { DocNode } from '@atlaskit/adf-schema';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import type { RendererContext } from '../';
import type { TextHighlighter, ExtensionViewportSize } from '../react/types';
import type { RenderOutputStat } from '../render-document';
import type { MediaOptions } from '../types/mediaOptions';
import type { SmartLinksOptions } from '../types/smartLinksOptions';
import type {
	HeadingAnchorLinksProps,
	NodeComponentsProps,
	RendererAppearance,
	StickyHeaderProps,
} from './Renderer/types';

interface RawObjectFeatureFlags {
	['renderer-render-tracking']: string;
}

export interface RendererProps {
	document: DocNode;
	dataProviders?: ProviderFactory;
	eventHandlers?: EventHandlers;
	extensionHandlers?: ExtensionHandlers;
	// Enables inline scripts to add support for breakout nodes,
	// before main JavaScript bundle is available.
	enableSsrInlineScripts?: boolean;
	// Enables inline scripts from above on client for first render for hydration to prevent mismatch.
	noOpSSRInlineScript?: boolean;
	onComplete?: (stat: RenderOutputStat) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	extensionViewportSizes?: ExtensionViewportSize[];
	allowAnnotations?: boolean;
	annotationProvider?: AnnotationProviders | null;
	innerRef?: React.RefObject<HTMLDivElement>;
	/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3649 Internal documentation for deprecation (no external access)} This prop will be removed and set as default enabled, as the same flag on the Editor is also now default enabled. */
	useSpecBasedValidator?: boolean;
	allowCopyToClipboard?: boolean;
	allowWrapCodeBlock?: boolean;
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
	isInsideOfInlineExtension?: boolean;
	isTopLevelRenderer?: boolean;
	includeNodesCountInStats?: boolean;
	/**
	 * When enabled a trailing telepointer will be added to the rendered document
	 * following content updates.
	 *
	 * Content is updated by passing a new value prop to the renderer.
	 *
	 * The trailing pointer is updated by dom injection to the last text node which
	 * is updated as a result of a content update.
	 */
	addTelepointer?: boolean;

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
	featureFlags?: { [featureFlag: string]: boolean } | Partial<RawObjectFeatureFlags>;

	UNSTABLE_textHighlighter?: TextHighlighter;
	UNSTABLE_allowTableAlignment?: boolean;
	UNSTABLE_allowTableResizing?: boolean;
}
