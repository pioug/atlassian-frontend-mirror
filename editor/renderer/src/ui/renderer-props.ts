import type { DocNode } from '@atlaskit/adf-schema';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type {
	ExtensionHandlers,
	ExtensionParams,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import type { GetPMNodeHeight } from '@atlaskit/editor-common/extensibility';

import type { ReactSerializerInit, RendererContext, Serializer } from '../';
import type { TextHighlighter, ExtensionViewportSize } from '../react/types';
import type { RenderOutputStat } from '../render-document';
import type { MediaOptions } from '../types/mediaOptions';
import type { SmartLinksOptions } from '../types/smartLinksOptions';
import type {
	HeadingAnchorLinksProps,
	NodeComponentsProps,
	RendererAppearance,
	RendererContentMode,
	StickyHeaderProps,
} from './Renderer/types';

interface RawObjectFeatureFlags {
	['renderer-render-tracking']: string;
}

export interface RendererProps {
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
	adfStage?: ADFStage;
	allowAltTextOnImages?: boolean;
	allowAnnotations?: boolean;
	allowColumnSorting?: boolean;
	allowCopyToClipboard?: boolean;
	allowCustomPanels?: boolean;
	allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	allowPlaceholderText?: boolean;
	allowRendererContainerStyles?: boolean;
	allowSelectAllTrap?: boolean;
	allowUgcScrubber?: boolean;
	allowWrapCodeBlock?: boolean;
	analyticsEventSeverityTracking?: {
		enabled: boolean;
		severityDegradedThreshold: number;
		severityNormalThreshold: number;
	};
	annotationProvider?: AnnotationProviders | null;
	// Note: this comment is replicated in packages/editor/editor-core/src/types/editor-props.ts
	// any changes should be made in both locations
	/*
	Configure the display mode of the editor. Different modes may have different feature sets supported.

	- `comment` - should be used for things like comments where you have a field input but require a toolbar & save/cancel buttons
	- `full-page` - should be used for a full page editor where it is the user focus of the page
	- `chromeless` - is essentially the `comment` editor but without the editor chrome, like toolbar & save/cancel buttons
	*/
	appearance?: RendererAppearance;
	// Note: this comment is replicated in packages/editor/editor-core/src/types/editor-props.ts
	// any changes should be made in both locations
	/**
	 * **WARNING** this attribute is not supported outside of Confluence Full Page editors
	 *
	 * Configures the content mode of the editor.
	 *
	 * - `"standard"` | `undefined` - normal content mode <- Default
	 * - `"compact"` - content in editor has reduced size
	 *
	 * @private
	 * @deprecated this attribute is not supported outside of Confluence Full Page editors
	 */
	contentMode?: RendererContentMode;

	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	/**
	 * Creates a new `Serializer` to transform the ADF `document` into `JSX.Element`.
	 * Allows Confluence to implement {@link https://hello.atlassian.net/wiki/spaces/~lmarinov/pages/5177285037/COMPLEXIT+Progressive+rendering+of+ADF progressive rendering}.
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	createSerializer?(init: ReactSerializerInit): Serializer<JSX.Element> | null;
	dataProviders?: ProviderFactory;
	disableActions?: boolean;
	disableHeadingIDs?: boolean;
	/**
	 * When true, disables the overflow shadow (visual indication) on the edges
	 * of tables.
	 */
	disableTableOverflowShadow?: boolean;
	document: DocNode;
	emojiResourceConfig?: EmojiResourceConfig;
	// Enables inline scripts to add support for breakout nodes,
	// before main JavaScript bundle is available.
	enableSsrInlineScripts?: boolean;
	eventHandlers?: EventHandlers;
	extensionHandlers?: ExtensionHandlers;
	extensionViewportSizes?: ExtensionViewportSize[];
	fadeOutHeight?: number;
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
	getExtensionHeight?: GetPMNodeHeight;
	includeNodesCountInStats?: boolean;
	innerRef?: React.RefObject<HTMLDivElement>;
	isInsideOfInlineExtension?: boolean;
	isTopLevelRenderer?: boolean;
	maxHeight?: number;
	media?: MediaOptions;
	nodeComponents?: NodeComponentsProps;
	// Enables inline scripts from above on client for first render for hydration to prevent mismatch.
	noOpSSRInlineScript?: boolean;
	onComplete?: (stat: RenderOutputStat) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onError?: (error: any) => void;
	/**
	 * Optional callback to programatically determine the link target for rendered links. Controls whether a link should render as external or not.
	 * Return _blank if the url should render as an external link.
	 * Return undefined to use the links default behavior and target.
	 *
	 * @param url - The URL of the link being rendered
	 * @returns '_blank' to render as an external link or undefined to not change the link
	 */
	onSetLinkTarget?: (url: string) => '_blank' | undefined;
	portal?: HTMLElement;
	rendererContext?: RendererContext;
	schema?: Schema;
	/**
	 * Determines if the extension should be displayed as inline based on the extension parameters.
	 * @param extensionParams - The extension parameters.
	 * @returns True if the extension should be displayed as inline, false otherwise.
	 */
	shouldDisplayExtensionAsInline?: (extensionParams: ExtensionParams<Parameters>) => boolean;
	shouldOpenMediaViewer?: boolean;
	// Removes the empty space, lines, hard breaks above and below the comment content
	shouldRemoveEmptySpaceAroundContent?: boolean;
	smartLinks?: SmartLinksOptions;
	stickyHeaders?: StickyHeaderProps;
	textHighlighter?: TextHighlighter;
	truncated?: boolean;

	UNSTABLE_allowTableAlignment?: boolean;

	UNSTABLE_allowTableResizing?: boolean;

	/**
	 * When true, elements may render without their default semantic roles
	 * (e.g., using role="presentation"), indicating that they are used solely for layout or styling purposes.
	 * Elements currently affected: Tables.
	 */
	UNSTABLE_isPresentational?: boolean;
	/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-26490 Internal documentation for deprecation (no external access)}  This prop has been marked stable and therefore replaced by the `textHighlighter` prop. Please use `textHighlighter` prop instead. */
	UNSTABLE_textHighlighter?: TextHighlighter;
	unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking;

	/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3649 Internal documentation for deprecation (no external access)} This prop will be removed and set as default enabled, as the same flag on the Editor is also now default enabled. */
	useSpecBasedValidator?: boolean;
}
