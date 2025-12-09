/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';
import React, { useImperativeHandle, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, useTheme, type Theme } from '@emotion/react';
import classnames from 'classnames';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { decisionListSelector, taskListSelector } from '@atlaskit/adf-schema';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
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
import { type BasePlugin } from '@atlaskit/editor-plugins/base';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import { type ViewMode } from '@atlaskit/editor-plugins/editor-viewmode';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
import { token } from '@atlaskit/tokens';

import type EditorActions from '../../../actions';
import type { ContentComponents, ReactComponents } from '../../../types';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ClickAreaBlock from '../../Addon/ClickAreaBlock';
import { contentComponentClickWrapper } from '../../Addon/ClickAreaBlock/contentComponentWrapper';
import { ContextPanel } from '../../ContextPanel';
import EditorContentContainer from '../../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../../PluginSlot';

import { contentAreaWrapper, sidebarArea } from './StyledComponents';
import type { ScrollContainerRefs } from './types';

const akEditorFullWidthLayoutWidth = 1800;
const akEditorUltraWideLayoutWidth = 4000;
const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
const tableMarginFullWidthMode = 2;
const akLayoutGutterOffset = 12;
const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const AK_NESTED_DND_GUTTER_OFFSET = 8;

const getTotalPadding = () => akEditorGutterPaddingDynamic() * 2;

const editorContentAreaProsemirrorStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .ProseMirror': {
		flexGrow: 1,
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > *': {
			clear: 'both',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`> p, > ul, > ol:not(${taskListSelector}):not(${decisionListSelector}), > h1, > h2, > h3, > h4, > h5, > h6`]:
			{
				clear: 'none',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> p:last-child': {
			marginBottom: token('space.300', '24px'),
		},
	},
});

const fullWidthNonChromelessBreakoutBlockTableStyle = css({
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
});

// An additional spacing applied at the top of the content area reserving space when the primary toolbar
// is hidden – this avoids layout shift when the toolbar is toggled under the editor controls feature
const contentAreaReservedPrimaryToolbarSpace = css({
	// extra 1px to account for the bottom border on the toolbar
	marginTop: `calc(${token('space.500', '40px')} + 1px)`,
});

// A reduced top spacing applied to the content area to compensate for the reserved space at the top
// of the page when the primary toolbar is hidden under the editor controls feature
const contentAreaReducedHeaderSpace = css({
	paddingTop: token('space.400', '32px'),
});

// new styles
const editorContentAreaNew = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '24px',
	paddingTop: token('space.600', '48px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area-no-toolbar &': {
		// When the toolbar is hidden, we don't want content to jump up
		// the extra 1px is to account for the border on the toolbar
		paddingTop: `calc(${token('space.600', '48px')} + var(--ak-editor-fullpage-toolbar-height) + 1px)`,
	},
	paddingBottom: token('space.600', '48px'),
	height: 'calc( 100% - 105px )',
	width: '100%',
	margin: 'auto',
	flexDirection: 'column',
	flexGrow: 1,
	maxWidth: 'var(--ak-editor-content-area-max-width)',
	transition: `max-width ${SWOOP_ANIMATION}`,
});

const tableFullPageEditorStylesNew = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror .pm-table-wrapper > table': {
		marginLeft: 0,
		/* 1px border width offset added here to prevent unwanted overflow and scolling - ED-16212 */
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginRight: '-1px',
		width: '100%',
	},
});

const editorContentAreaContainerNestedDndStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.fabric-editor--full-width-mode': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-layout-section]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			maxWidth: `calc(100% + ${(akLayoutGutterOffset + AK_NESTED_DND_GUTTER_OFFSET) * 2}px)`,
		},
	},
});

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyleExcludeCodeBlockNew = css({
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
});

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyleNew = css({
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
});

const editorContentGutterStyleFG = css({
	padding: '0 72px',
});

const editorContentGutterStyles = css({
	boxSizing: 'border-box',
	padding: '0 52px',
});

const editorContentReducedGutterStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: `0 ${akEditorGutterPaddingReduced}px`,
	},
});

const contentAreaNew = css({
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
});

const contentAreaHeightNoToolbar = css({
	height: '100%',
});

interface FullPageEditorContentAreaProps {
	appearance: EditorAppearance | undefined;
	contentComponents: UIComponentFactory[] | undefined;
	contentMode: EditorContentMode | undefined;
	contextPanel: ReactComponents | undefined;
	customContentComponents: ContentComponents | undefined;
	disabled: boolean | undefined;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	editorActions: EditorActions | undefined;
	editorAPI: PublicPluginAPI<[OptionalPlugin<ContextPanelPlugin>, BasePlugin]> | undefined;
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
export const EDITOR_CONTAINER = 'ak-editor-container';

const Content = React.forwardRef<
	ScrollContainerRefs,
	FullPageEditorContentAreaProps & WrappedComponentProps
>((props, ref) => {
	const theme: Theme = useTheme();
	const fullWidthMode = props.appearance === 'full-width';
	const maxWidthMode = props.appearance === 'max';
	const scrollContainerRef = useRef(null);
	const contentAreaRef = useRef(null);
	const containerRef = useRef(null);
	const allowScrollGutter = props.editorAPI?.base?.sharedState.currentState()?.allowScrollGutter;

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

	return (
		<div
			css={[contentAreaNew, props.isEditorToolbarHidden && contentAreaHeightNoToolbar]}
			data-testid={CONTENT_AREA_TEST_ID}
			ref={containerRef}
		>
			<div
				css={
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					contentAreaWrapper
				}
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
				>
					<ClickAreaBlock editorView={props.editorView} editorDisabled={props.disabled}>
						<div
							css={[
								editorContentAreaNew,
								editorContentAreaProsemirrorStyle,
								tableFullPageEditorStylesNew,
								fullWidthNonChromelessBreakoutBlockTableStyle,
								// for breakout resizing, there's no need to restrict the width of codeblocks as they're always wrapped in a breakout mark
								expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
								fg('platform_editor_breakout_resizing_width_changes')
									? editorContentAreaContainerStyleExcludeCodeBlockNew
									: editorContentAreaContainerStyleNew,
								fg('platform_editor_nested_dnd_styles_changes') &&
									editorContentAreaContainerNestedDndStyle,
								!fg('platform_editor_controls_no_toolbar_space') &&
									editorExperiment('platform_editor_controls', 'variant1') &&
									contentAreaReducedHeaderSpace,
								!fg('platform_editor_controls_no_toolbar_space') &&
									props.isEditorToolbarHidden &&
									editorExperiment('platform_editor_controls', 'variant1') &&
									contentAreaReservedPrimaryToolbarSpace,
							]}
							style={
								{
									'--ak-editor-content-area-max-width': !fullWidthMode
										? Boolean(maxWidthMode) &&
											expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true)
											? // @ts-ignore
												`${akEditorUltraWideLayoutWidth + getTotalPadding()}px`
											: // @ts-ignore
												`${theme.layoutMaxWidth + getTotalPadding()}px`
										: `${akEditorFullWidthLayoutWidth + getTotalPadding()}px`,
								} as React.CSSProperties
							}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className="ak-editor-content-area-region"
							data-editor-editable-content
							role="region"
							aria-label={props.intl.formatMessage(messages.editableContentLabel)}
							ref={contentAreaRef}
						>
							<div
								css={[
									editorContentGutterStyles,
									// eslint-disable-next-line @atlaskit/platform/no-preconditioning
									fg('platform_editor_controls_increase_full_page_gutter') &&
										editorExperiment('platform_editor_controls', 'variant1') &&
										editorContentGutterStyleFG,
									editorExperiment('platform_editor_preview_panel_responsiveness', true, {
										exposure: true,
									}) && editorContentReducedGutterStyles,
								]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={classnames('ak-editor-content-area', 'appearance-full-page', {
									'fabric-editor--full-width-mode': fullWidthMode,
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
								{expVal('platform_editor_scroll_gutter_fix', 'isEnabled', false) &&
									allowScrollGutter && (
										<div
											id="editor-scroll-gutter"
											style={{ paddingBottom: `${allowScrollGutter.gutterSize ?? '120'}px` }}
											data-vc="scroll-gutter"
										></div>
									)}
							</div>
						</div>
					</ClickAreaBlock>
				</EditorContentContainer>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={sidebarArea}>
				{props.contextPanel || <ContextPanel editorAPI={props.editorAPI} visible={false} />}
			</div>
		</div>
	);
});

export const FullPageContentArea = injectIntl(Content, { forwardRef: true });
