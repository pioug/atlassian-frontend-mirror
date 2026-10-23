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

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics/types/dispatch-analytics-event';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { messages } from '@atlaskit/editor-common/messages/full-page';
import type ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type {
	EditorAppearance,
	EditorContentMode,
} from '@atlaskit/editor-common/types/editor-appearance';
import type { FeatureFlags } from '@atlaskit/editor-common/types/feature-flags';
import type {
	OptionalPlugin,
	PublicPluginAPI,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type {
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types/ui-components';
import type { BasePlugin } from '@atlaskit/editor-plugins/base';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugins/block-menu';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import type { ViewMode } from '@atlaskit/editor-plugins/editor-viewmode';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles/constants';
import type { akEditorGutterPaddingReduced as AkEditorGutterPaddingReducedType } from '@atlaskit/editor-shared-styles/constants';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';
import { token } from '@atlaskit/tokens';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import type EditorActions from '../../../actions';
import type { ContentComponents, ReactComponents } from '../../../types/editor-props';
import { ClickAreaBlock } from '../../Addon/ClickAreaBlock';
import { contentComponentClickWrapper } from '../../Addon/ClickAreaBlock/contentComponentWrapper';
import { ContextPanel } from '../../ContextPanel';
import EditorContentContainer from '../../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../../PluginSlot';
import type { ScrollContainerRefs } from './types';
const akLayoutGutterOffsetStatic = 12 satisfies typeof akLayoutGutterOffset;

const akEditorGutterPaddingReducedStatic = 24 satisfies typeof AkEditorGutterPaddingReducedType;

const akEditorFullWidthLayoutWidth = 1800;
const akEditorUltraWideLayoutWidth = 4000;
const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
const tableMarginFullWidthMode = 2;
const akLayoutGutterOffset = 12;
const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const AK_NESTED_DND_GUTTER_OFFSET = 8;

const getTotalPadding = () => akEditorGutterPaddingDynamic() * 2;

// Isolates the scroll container's layout and size from the rest of the page.
// Because of contain: size wrapper must take its height from the parent
// rather than from the contained content.
const containLayoutStyles = cssMap({
	wrapper: {
		contain: 'layout size',
		height: '100%',
	},
});

const compiledStyles = cssMap({
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
				maxWidth: `calc(100% + ${akLayoutGutterOffsetStatic * 2}px)`,
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
			padding: `0 ${akEditorGutterPaddingReducedStatic}px`,
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
});

type EditorAPI = PublicPluginAPI<
	[OptionalPlugin<ContextPanelPlugin>, BasePlugin, OptionalPlugin<BlockMenuPlugin>]
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
	UNSAFE_containLayout?: boolean;
	viewMode: ViewMode | undefined;
	wrapperElement: HTMLElement | null;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
const EDITOR_CONTAINER = 'ak-editor-container';

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

	const content = (
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
					css={[
						compiledStyles.editorContentAreaNew,
						compiledStyles.editorContentAreaProsemirrorStyle,
						compiledStyles.tableFullPageEditorStylesNew,
						compiledStyles.fullWidthNonChromelessBreakoutBlockTableStyle,
						// for breakout resizing, there's no need to restrict the width of codeblocks as they're always wrapped in a breakout mark
						compiledStyles.editorContentAreaContainerStyleExcludeCodeBlockNew,
						compiledStyles.editorContentAreaContainerNestedDndStyle,
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
							compiledStyles.editorContentGutterStyleFG,
							editorExperiment('platform_editor_preview_panel_responsiveness', true, {
								exposure: true,
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
						{allowScrollGutter && (
							<div
								id="editor-scroll-gutter"
								style={{ paddingBottom: `${allowScrollGutter.gutterSize ?? '120'}px` }}
								data-vc="scroll-gutter"
								data-editor-scroll-gutter="true"
							></div>
						)}
					</div>
				</div>
			</ClickAreaBlock>
		</EditorContentContainer>
	);

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
				css={compiledStyles.contentAreaWrapper}
				data-testid={EDITOR_CONTAINER}
				data-editor-container={'true'}
			>
				{props.UNSAFE_containLayout ? (
					<div
						data-testid="editor-contain-size-and-layout-wrapper"
						css={containLayoutStyles.wrapper}
					>
						{content}
					</div>
				) : (
					content
				)}
			</div>
			<div css={compiledStyles.sidebarArea}>
				{props.contextPanel || <ContextPanel editorAPI={props.editorAPI} visible={false} />}
			</div>
		</div>
	);
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const FullPageContentArea: React.ForwardRefExoticComponent<
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
