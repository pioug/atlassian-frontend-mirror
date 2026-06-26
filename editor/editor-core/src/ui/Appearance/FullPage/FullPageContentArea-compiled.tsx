/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';
import React, { useImperativeHandle, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';
import classnames from 'classnames';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { fullPageMessages as messages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	EditorContentMode,
	FeatureFlags,
	OptionalPlugin,
	PublicPluginAPI,
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { BasePlugin } from '@atlaskit/editor-plugins/base';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugins/block-menu';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { ViewMode } from '@atlaskit/editor-plugins/editor-viewmode';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import type EditorActions from '../../../actions';
import type { ContentComponents, ReactComponents } from '../../../types/editor-props';
import type { MarkdownModePlugin } from '../../../types/markdown-mode';
import { ClickAreaBlock } from '../../Addon/ClickAreaBlock';
import { contentComponentClickWrapper } from '../../Addon/ClickAreaBlock/contentComponentWrapper';
import { ContextPanel } from '../../ContextPanel';
import EditorContentContainer from '../../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../../PluginSlot';

import type { ScrollContainerRefs } from './types';

const akEditorFullWidthLayoutWidth = 1800;
const akEditorUltraWideLayoutWidth = 4000;
const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
const tableMarginFullWidthMode = 2;
const akLayoutGutterOffset = 12;
const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const AK_NESTED_DND_GUTTER_OFFSET = 8;

const getTotalPadding = () => akEditorGutterPaddingDynamic() * 2;

const compiledStyles = cssMap({
	// originally from contentAreaWrapper in packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
	// clean up above comment when tidy up platform_editor_core_non_ecc_static_css
	contentAreaWrapper: {
		width: '100%',
		containerType: 'inline-size',
		containerName: 'editor-area',
		// Chrome 129 Regression!
		// By the spec, when the container-type: inline-size is used
		// The browser should apply the bewlo properties to the element.
		// However, for reasons that goes beyond my knowledge.
		// Chrome 129 broke that behavior, and now we need to make it explicity.
		contain: 'layout style inline-size',
	},
	// originally from sidebarArea in packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts
	// clean up above comment when tidy up platform_editor_core_non_ecc_static_css
	sidebarArea: {
		height: '100%',
		boxSizing: 'border-box',
		alignSelf: 'flex-end',

		// Make the sidebar sticky within the legacy content macro
		// to prevent it from aligning to the bottom with large content.
		// This style is only applied when opening inside the legacy content macro.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'.extension-editable-area &': {
			height: 'auto',
			position: 'sticky',
			top: 0,
			alignSelf: 'flex-start',
		},
	},
	editorContentAreaProsemirrorStyle: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& .ProseMirror': {
			flexGrow: 1,
			boxSizing: 'border-box',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'& > *': {
				clear: 'both',
			},
			// Hardcoded selector values: taskListSelector=[data-node-type="actionList"], decisionListSelector=[data-node-type="decisionList"]
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'> p, > ul, > ol:not([data-node-type="actionList"]):not([data-node-type="decisionList"]), > h1, > h2, > h3, > h4, > h5, > h6':
				{
					clear: 'none',
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'> p:last-child': {
				marginBottom: token('space.300'),
			},
		},
	},
	/*
	 EDITOR-7249: Scope to the main editor's ProseMirror (direct child) so nested
	 editors like the footer page-comment composer aren't hidden in Syntax view.
	*/
	hideEditorContentAreaProsemirrorWithAttributeStyle: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-markdown-mode-hide-prosemirror="true"] > .ak-editor-content-area > .ProseMirror': {
			display: 'none',
		},
	},
	hideEditorContentAreaScrollGutterWithAttributeStyle: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-markdown-mode-hide-scroll-gutter="true"] > .ak-editor-content-area > [data-vc="scroll-gutter"]':
			{
				display: 'none',
			},
	},
	hideEditorScrollGutterStyle: {
		display: 'none',
	},
	fullWidthNonChromelessBreakoutBlockTableStyle: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-1
		'.fabric-editor--full-width-mode:not(:has(#chromeless-editor))': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.fabric-editor-breakout-mark, .extension-container.block, .pm-table-container': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				width: '100% !important',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.fabric-editor-breakout-mark': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				marginLeft: 'unset !important',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				transform: 'none !important',
			},
		},
	},
	// An additional spacing applied at the top of the content area reserving space when the primary toolbar
	// is hidden â€“ this avoids layout shift when the toolbar is toggled under the editor controls feature
	contentAreaReservedPrimaryToolbarSpace: {
		// extra 1px to account for the bottom border on the toolbar
		marginTop: `calc(${token('space.500')} + 1px)`,
	},
	// A reduced top spacing applied to the content area to compensate for the reserved space at the top
	// of the page when the primary toolbar is hidden under the editor controls feature
	contentAreaReducedHeaderSpace: {
		paddingTop: token('space.400'),
	},
	// new styles
	editorContentAreaNew: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '24px',
		paddingTop: token('space.600'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ak-editor-content-area-no-toolbar &': {
			// When the toolbar is hidden, we don't want content to jump up
			// the extra 1px is to account for the border on the toolbar
			paddingTop: `calc(${token('space.600')} + var(--ak-editor-fullpage-toolbar-height) + 1px)`,
		},
		paddingBottom: token('space.600'),
		height: 'calc( 100% - 105px )',
		width: '100%',
		margin: 'auto',
		flexDirection: 'column',
		flexGrow: 1,
		maxWidth: 'var(--ak-editor-content-area-max-width)',
		transition: `max-width ${SWOOP_ANIMATION}`,
	},
	tableFullPageEditorStylesNew: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper > table': {
			marginLeft: 0,
			/* 1px border width offset added here to prevent unwanted overflow and scolling - ED-16212 */
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginRight: '-1px',
			width: '100%',
		},
	},
	editorContentAreaContainerNestedDndStyle: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.fabric-editor--full-width-mode': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'[data-layout-section]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: `calc(100% + ${(akLayoutGutterOffset + AK_NESTED_DND_GUTTER_OFFSET) * 2}px)`,
			},
		},
	},
	/* Prevent horizontal scroll on page in full width mode */
	editorContentAreaContainerStyleExcludeCodeBlockNew: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor--full-width-mode': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.extension-container, .multiBodiedExtension--container': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: `calc(100% - ${tableMarginFullWidthMode * 2}px)`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.extension-container.inline': {
				maxWidth: '100%',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'td .extension-container.inline': {
				maxWidth: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'[data-layout-section]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: `calc(100% + ${akLayoutGutterOffset * 2}px)`,
			},
		},
	},
	/* Prevent horizontal scroll on page in full width mode */
	editorContentAreaContainerStyleNew: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor--full-width-mode': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.code-block, .extension-container, .multiBodiedExtension--container': {
				maxWidth: `calc(100% - ${tableMarginFullWidthMode * 2}px)`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.extension-container.inline': {
				maxWidth: '100%',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'td .extension-container.inline': {
				maxWidth: 'inherit',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'[data-layout-section]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				maxWidth: `calc(100% + ${akLayoutGutterOffset * 2}px)`,
			},
		},
	},
	editorContentGutterStyleFG: {
		padding: '0 72px',
	},
	editorContentGutterStyles: {
		boxSizing: 'border-box',
		padding: '0 52px',
	},
	editorContentReducedGutterStyles: {
		// 600px was from akEditorFullPageNarrowBreakout, have to inline as it'd break compiled css build
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		'@container editor-area (max-width: 600px)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			padding: `0 ${akEditorGutterPaddingReduced}px`,
		},
	},
	contentAreaNew: {
		display: 'flex',
		flexDirection: 'row',
		height: `calc(100% - var(--ak-editor-fullpage-toolbar-height))`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		'&.ak-editor-content-area-no-toolbar': {
			// The editor toolbar height is 1px off (from the border) -- so we need to add 1px to the height
			// to match the toolbar height
			height: `calc(100% + 1px)`,
		},
		boxSizing: 'border-box',
		margin: 0,
		padding: 0,
		transition: `padding 0ms ${akEditorSwoopCubicBezier}`,
	},
	contentAreaHeightNoToolbar: {
		height: '100%',
	},
	// When the markdown source view is shown (markdown mode toggled on and not in
	// the WYSIWYG "preview" view) we tint the whole editor container with the
	// sunken surface so the source editor reads as a distinct, inset surface.
	markdownModeContainerBackgroundStyle: {
		backgroundColor: token('elevation.surface.sunken'),
		// In the markdown MVP layout the source view (CodeMirror) is bounded to the
		// viewport and owns its own scrolling, so the editor's scroll container must
		// not also own vertical scrolling — its always-on `overflow-y: scroll` track
		// would otherwise render a second, redundant scrollbar alongside CodeMirror's.
		// This style is only applied in markdown source mode, so WYSIWYG / preview
		// scrolling is unaffected.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- scoped override of the descendant scroll container
		'& [data-editor-scroll-container="true"]': {
			overflowY: 'hidden',
		},
	},
	markdownModeContentAreaStyle: {
		boxSizing: 'border-box',
		height: '100%',
		margin: 0,
		maxWidth: 'none',
		minWidth: 0,
		paddingBottom: 0,
		// No top padding here: it would inset the whole source view (including
		// CodeMirror's `.cm-scroller`), leaving a gap above the editor's vertical
		// scrollbar. The top inset is applied inside the scroller instead (see the
		// `.cm-scroller` `paddingTop` in MarkdownSourceView) so the scrollbar still
		// spans the full height.
		paddingTop: 0,
		width: '100%',
		// The markdown source view is rendered through PluginSlot. Stretch those
		// intermediate wrappers so its in-flow footer can sit at the bottom without
		// overlaying the CodeMirror scrollbar.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .ak-editor-content-area': {
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			minHeight: 0,
			minWidth: 0,
			padding: 0,
			width: '100%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .ak-editor-content-area > [data-testid="plugins-components-wrapper"]': {
			display: 'flex',
			flex: '1 1 auto',
			minHeight: 0,
			minWidth: 0,
			width: '100%',
		},
	},
});

type EditorAPI = PublicPluginAPI<
	[
		OptionalPlugin<ContextPanelPlugin>,
		BasePlugin,
		OptionalPlugin<BlockMenuPlugin>,
		OptionalPlugin<MarkdownModePlugin>,
	]
>;

interface FullPageEditorContentAreaProps {
	appearance: EditorAppearance | undefined;
	contentComponents: UIComponentFactory[] | undefined;
	contentMode: EditorContentMode | undefined;
	contextPanel: ReactComponents | undefined;
	customContentComponents: ContentComponents | undefined;
	disabled: boolean | undefined;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	editorActions: EditorActions | undefined;
	editorAPI: EditorAPI | undefined;
	editorDOMElement: ReactElement;
	editorView: EditorView;
	eventDispatcher: EventDispatcher | undefined;
	featureFlags?: FeatureFlags;
	hasHadInteraction?: boolean;
	isEditorToolbarHidden?: boolean;
	pluginHooks: ReactHookFactory[] | undefined;
	popupsBoundariesElement: HTMLElement | undefined;
	popupsMountPoint: HTMLElement | undefined;
	popupsScrollableElement: HTMLElement | undefined;
	providerFactory: ProviderFactory;
	viewMode: ViewMode | undefined;
	wrapperElement: HTMLElement | null;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const EDITOR_CONTAINER = 'ak-editor-container';

const Content = React.forwardRef<
	ScrollContainerRefs,
	FullPageEditorContentAreaProps & WrappedComponentProps
>((props, ref) => {
	const fullWidthMode = props.appearance === 'full-width';
	const maxWidthMode = props.appearance === 'max';
	const scrollContainerRef = useRef(null);
	const contentAreaRef = useRef(null);
	const containerRef = useRef(null);
	const allowScrollGutter = props.editorAPI?.base?.sharedState.currentState()?.allowScrollGutter;
	const contentAreaMaxWidth =
		getTotalPadding() +
		(!fullWidthMode
			? maxWidthMode
				? akEditorUltraWideLayoutWidth
				: akEditorDefaultLayoutWidth
			: akEditorFullWidthLayoutWidth);

	// Get useStandardNodeWidth from block menu plugin shared state
	// Only access editorAPI when the experiment is enabled to avoid performance impact
	const useStandardNodeWidth =
		editorExperiment('platform_editor_controls', 'variant1') &&
		(props.editorAPI?.blockMenu?.sharedState?.currentState()?.useStandardNodeWidth ?? false);

	useImperativeHandle(
		ref,
		() => ({
			get scrollContainer() {
				return scrollContainerRef.current;
			},
			get contentArea() {
				return contentAreaRef.current;
			},
			get containerArea() {
				return containerRef.current;
			},
		}),
		[],
	);

	const markdownPluginCurrentView = useSharedPluginStateWithSelector(
		props.editorAPI,
		['markdownMode'],
		(states) => states.markdownModeState?.view,
	);

	const markdownPluginCurrentIsMarkdownMode = useSharedPluginStateWithSelector(
		props.editorAPI,
		['markdownMode'],
		(states) => states.markdownModeState?.isMarkdownMode,
	);
	const isMarkdownModeExperimentEnabled = expValEqualsNoExposure(
		'cc-markdown-mode',
		'isEnabled',
		true,
	);
	const shouldHideProseMirrorForMarkdownMode =
		isMarkdownModeExperimentEnabled &&
		markdownPluginCurrentView !== 'preview' &&
		markdownPluginCurrentIsMarkdownMode;
	const shouldHideScrollGutterForMarkdownMode =
		isMarkdownModeExperimentEnabled && markdownPluginCurrentIsMarkdownMode;
	const shouldUseMarkdownModeMvpLayout =
		shouldHideProseMirrorForMarkdownMode && fg('platform_editor_md_mvp_layout');

	return (
		<div
			css={[
				compiledStyles.contentAreaNew,
				props.isEditorToolbarHidden && compiledStyles.contentAreaHeightNoToolbar,
			]}
			data-testid={CONTENT_AREA_TEST_ID}
			ref={containerRef}
		>
			<div
				css={[
					compiledStyles.contentAreaWrapper,
					// TODO: EDITOR-7801 - When we remove emotion usage in editor-core, we can remove the any cast.
					shouldUseMarkdownModeMvpLayout &&
						// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type issue occurred due to compiled css migration
						(compiledStyles.markdownModeContainerBackgroundStyle as any),
				]}
				data-testid={EDITOR_CONTAINER}
				data-editor-container={'true'}
			>
				<EditorContentContainer
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="fabric-editor-popup-scroll-parent"
					featureFlags={props.featureFlags}
					ref={scrollContainerRef}
					viewMode={props?.viewMode}
					isScrollable
					appearance={props.appearance}
					contentMode={props.contentMode}
					useStandardNodeWidth={useStandardNodeWidth}
				>
					<ClickAreaBlock editorView={props.editorView} editorDisabled={props.disabled}>
						<div
							data-markdown-mode-hide-prosemirror={
								shouldHideProseMirrorForMarkdownMode ? 'true' : undefined
							}
							data-markdown-mode-hide-scroll-gutter={
								shouldHideScrollGutterForMarkdownMode ? 'true' : undefined
							}
							css={[
								compiledStyles.editorContentAreaNew,
								// TODO: EDITOR-7801 - When we remove emotion usage in editor-core, we can remove the any cast.
								// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type issue occurred due to compiled css migration
								compiledStyles.editorContentAreaProsemirrorStyle as any,
								// EDITOR-6558: hide ProseMirror when the markdown-mode plugin
								// reports a non-WYSIWYG view.
								shouldHideProseMirrorForMarkdownMode &&
									compiledStyles.hideEditorContentAreaProsemirrorWithAttributeStyle,
								shouldHideScrollGutterForMarkdownMode &&
									compiledStyles.hideEditorContentAreaScrollGutterWithAttributeStyle,
								// TODO: EDITOR-7801 - When we remove emotion usage in editor-core, we can remove the any cast.
								shouldUseMarkdownModeMvpLayout &&
									// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type issue occurred due to compiled css migration
									(compiledStyles.markdownModeContentAreaStyle as any),
								compiledStyles.tableFullPageEditorStylesNew,
								compiledStyles.fullWidthNonChromelessBreakoutBlockTableStyle,
								// for breakout resizing, there's no need to restrict the width of codeblocks as they're always wrapped in a breakout mark
								expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
									? compiledStyles.editorContentAreaContainerStyleExcludeCodeBlockNew
									: compiledStyles.editorContentAreaContainerStyleNew,
								fg('platform_editor_nested_dnd_styles_changes') &&
									compiledStyles.editorContentAreaContainerNestedDndStyle,
								!fg('platform_editor_controls_no_toolbar_space') &&
									editorExperiment('platform_editor_controls', 'variant1') &&
									compiledStyles.contentAreaReducedHeaderSpace,
								!fg('platform_editor_controls_no_toolbar_space') &&
									props.isEditorToolbarHidden &&
									editorExperiment('platform_editor_controls', 'variant1') &&
									compiledStyles.contentAreaReservedPrimaryToolbarSpace,
							]}
							style={
								{
									'--ak-editor-content-area-max-width': `${contentAreaMaxWidth}px`,
								} as React.CSSProperties
							}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className="ak-editor-content-area-region"
							data-editor-editable-content
							role="region"
							aria-label={props.intl.formatMessage(messages.editableContentLabel)}
							ref={contentAreaRef}
							data-vc="editor-content-area-region"
						>
							<div
								css={[
									compiledStyles.editorContentGutterStyles,
									// eslint-disable-next-line @atlaskit/platform/no-preconditioning
									fg('platform_editor_controls_increase_full_page_gutter') &&
										editorExperiment('platform_editor_controls', 'variant1') &&
										compiledStyles.editorContentGutterStyleFG,
									editorExperiment('platform_editor_preview_panel_responsiveness', true, {
										exposure: true,
										// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
									}) && compiledStyles.editorContentReducedGutterStyles,
								]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={classnames('ak-editor-content-area', 'appearance-full-page', {
									'fabric-editor--full-width-mode': fullWidthMode,
									'fabric-editor--max-width-mode': Boolean(maxWidthMode),
								})}
								ref={contentAreaRef}
							>
								{!!props.customContentComponents && 'before' in props.customContentComponents
									? contentComponentClickWrapper(props.customContentComponents.before)
									: contentComponentClickWrapper(props.customContentComponents)}
								<PluginSlot
									editorView={props.editorView}
									editorActions={props.editorActions}
									eventDispatcher={props.eventDispatcher}
									providerFactory={props.providerFactory}
									appearance={props.appearance}
									items={props.contentComponents}
									pluginHooks={props.pluginHooks}
									contentArea={contentAreaRef.current ?? undefined}
									popupsMountPoint={props.popupsMountPoint}
									popupsBoundariesElement={props.popupsBoundariesElement}
									popupsScrollableElement={props.popupsScrollableElement}
									disabled={!!props.disabled}
									containerElement={scrollContainerRef.current}
									dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
									wrapperElement={props.wrapperElement}
								/>
								{props.editorDOMElement}
								{!!props.customContentComponents && 'after' in props.customContentComponents
									? contentComponentClickWrapper(props.customContentComponents.after)
									: null}
								{allowScrollGutter &&
									(editorExperiment('platform_editor_blocks', true) ? (
										<div
											id="editor-scroll-gutter"
											css={
												shouldHideScrollGutterForMarkdownMode &&
												compiledStyles.hideEditorScrollGutterStyle
											}
											style={{ paddingBottom: `${allowScrollGutter.gutterSize ?? '120'}px` }}
											data-vc="scroll-gutter"
											data-editor-scroll-gutter="true"
										></div>
									) : (
										<div
											id="editor-scroll-gutter"
											css={
												shouldHideScrollGutterForMarkdownMode &&
												compiledStyles.hideEditorScrollGutterStyle
											}
											style={{ paddingBottom: `${allowScrollGutter.gutterSize ?? '120'}px` }}
											data-vc="scroll-gutter"
										></div>
									))}
							</div>
						</div>
					</ClickAreaBlock>
				</EditorContentContainer>
			</div>
			{/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type issue occurred due to compiled css migration */}
			<div css={compiledStyles.sidebarArea as any}>
				{props.contextPanel || <ContextPanel editorAPI={props.editorAPI} visible={false} />}
			</div>
		</div>
	);
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const FullPageContentAreaCompiled: React.ForwardRefExoticComponent<
	Omit<
		WithIntlProps<
			React.PropsWithChildren<
				FullPageEditorContentAreaProps &
					WrappedComponentProps &
					React.RefAttributes<ScrollContainerRefs>
			>
		>,
		'ref'
	> &
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		React.RefAttributes<any>
> & {
	WrappedComponent: React.ComponentType<
		FullPageEditorContentAreaProps &
			WrappedComponentProps &
			React.RefAttributes<ScrollContainerRefs>
	>;
} = injectIntl(Content, { forwardRef: true });
