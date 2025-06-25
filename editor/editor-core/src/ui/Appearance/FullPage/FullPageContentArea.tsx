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
	FeatureFlags,
	OptionalPlugin,
	PublicPluginAPI,
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import { type ContextPanelPlugin } from '@atlaskit/editor-plugins/context-panel';
import { type ViewMode } from '@atlaskit/editor-plugins/editor-viewmode';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugins/table/ui/common-styles';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	FULL_PAGE_EDITOR_TOOLBAR_HEIGHT as FULL_PAGE_EDITOR_TOOLBAR_HEIGHT_OLD,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';
import { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type EditorActions from '../../../actions';
import type { ContentComponents, ReactComponents } from '../../../types';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ClickAreaBlock from '../../Addon/ClickAreaBlock';
import { contentComponentClickWrapper } from '../../Addon/ClickAreaBlock/contentComponentWrapper';
import { createEditorContentStyle } from '../../ContentStyles';
import { ContextPanel } from '../../ContextPanel';
import EditorContentContainer from '../../EditorContentContainer/EditorContentContainer';
import PluginSlot from '../../PluginSlot';

import { contentArea, contentAreaWrapper, sidebarArea } from './StyledComponents';
import type { ScrollContainerRefs } from './types';

const akEditorFullWidthLayoutWidth = 1800;
const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
const tableMarginFullWidthMode = 2;
const akLayoutGutterOffset = 12;
const SWOOP_ANIMATION = `0.5s ${akEditorSwoopCubicBezier}`;
const AK_NESTED_DND_GUTTER_OFFSET = 8;
const FULL_PAGE_EDITOR_TOOLBAR_HEIGHT = token('space.500', '40px');
const FULL_PAGE_EDITOR_TOOLBAR_HEIGHT_LIVE_PAGE = '2.188rem';

const getTotalPadding = () => akEditorGutterPaddingDynamic() * 2;

// old styles - to be deleted when cleaning up experiment `platform_editor_core_static_emotion_non_central`
const editorContentAreaStyle = ({
	layoutMaxWidth,
	fullWidthMode,
	isEditorToolbarHidden,
}: {
	layoutMaxWidth: number;
	fullWidthMode: boolean;
	isEditorToolbarHidden?: boolean;
}) => [
	editorContentArea,
	editorContentAreaProsemirrorStyle,
	fg('platform_editor_fix_table_width_inline_comment')
		? fullWidthNonChromelessBreakoutBlockTableStyle
		: fullWidthModeBreakoutBlockTableStyle,
	!fullWidthMode && editorContentAreaWithLayoutWith(layoutMaxWidth),
	// for breakout resizing, there's no need to restrict the width of codeblocks as they're always wrapped in a breakout mark
	expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
	fg('platform_editor_breakout_resizing_width_changes')
		? editorContentAreaContainerStyleExcludeCodeBlock()
		: editorContentAreaContainerStyle(),
	...(fg('platform_editor_controls_no_toolbar_space')
		? []
		: [
				editorExperiment('platform_editor_controls', 'variant1') &&
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					contentAreaReducedHeaderSpace,
				isEditorToolbarHidden &&
					editorExperiment('platform_editor_controls', 'variant1') &&
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					contentAreaReservedPrimaryToolbarSpace,
			]),
];

const editorContentAreaWithLayoutWith = (layoutMaxWidth: number) =>
	css({
		// this restricts max width
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `${layoutMaxWidth + getTotalPadding()}px`,
	});

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyleExcludeCodeBlock = () =>
	css({
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
				maxWidth: `calc(100% + ${(akLayoutGutterOffset + (fg('platform_editor_nested_dnd_styles_changes') ? AK_NESTED_DND_GUTTER_OFFSET : 0)) * 2}px)`,
			},
		},
	});

/* Prevent horizontal scroll on page in full width mode */
const editorContentAreaContainerStyle = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.fabric-editor--full-width-mode': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'.code-block, .extension-container, .multiBodiedExtension--container': {
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
				maxWidth: `calc(100% + ${(akLayoutGutterOffset + (fg('platform_editor_nested_dnd_styles_changes') ? AK_NESTED_DND_GUTTER_OFFSET : 0)) * 2}px)`,
			},
		},
	});

const editorContentArea = css(
	{
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '24px',
		paddingTop: token('space.600', '48px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ak-editor-content-area-no-toolbar &': {
			// When the toolbar is hidden, we don't want content to jump up
			// the extra 1px is to account for the border on the toolbar
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,  @atlaskit/ui-styling-standard/no-unsafe-values
			paddingTop: `calc(${token('space.600', '48px')} + ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT_OLD()} + 1px)`,
		},
		paddingBottom: token('space.600', '48px'),
		height: 'calc( 100% - 105px )',
		width: '100%',
		margin: 'auto',
		flexDirection: 'column',
		flexGrow: 1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `${akEditorFullWidthLayoutWidth + getTotalPadding()}px`,
		transition: `max-width ${SWOOP_ANIMATION}`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	tableFullPageEditorStyles,
);

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

const fullWidthModeBreakoutBlockTableStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-1
	'.fabric-editor--full-width-mode': {
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

const editorContentGutterStyle = () => {
	return css({
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		padding: `0 ${akEditorGutterPaddingDynamic()}px`,
	});
};

// new styles
const editorContentAreaNoToolbarLivePageJumpMitigation = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area-no-toolbar &': {
		paddingTop: `calc(${token('space.600', '48px')} + ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT_LIVE_PAGE} + 1px)`,
	},
});

const editorContentAreaNoToolbarControls = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area-no-toolbar &': {
		paddingTop: `calc(${token('space.600', '48px')} + ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT} + 1px)`,
	},
});

const editorContentAreaNew = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '24px',
	paddingTop: token('space.600', '48px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area-no-toolbar &': {
		// When the toolbar is hidden, we don't want content to jump up
		// the extra 1px is to account for the border on the toolbar
		paddingTop: `calc(${token('space.600', '48px')} + ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT} + 1px)`,
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

const contentAreaNew = css({
	display: 'flex',
	flexDirection: 'row',
	height: `calc(100% - ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT})`,
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

const contentAreaHeightLivePageJumpMitigation = css({
	height: `calc(100% - ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT_LIVE_PAGE})`,
});

const contentAreaHeightControls = css({
	height: `calc(100% - ${FULL_PAGE_EDITOR_TOOLBAR_HEIGHT})`,
});

const contentAreaHeightNoToolbar = css({
	height: '100%',
});

interface FullPageEditorContentAreaProps {
	editorAPI: PublicPluginAPI<[OptionalPlugin<ContextPanelPlugin>]> | undefined;
	appearance: EditorAppearance | undefined;
	contentComponents: UIComponentFactory[] | undefined;
	pluginHooks: ReactHookFactory[] | undefined;
	contextPanel: ReactComponents | undefined;
	customContentComponents: ContentComponents | undefined;
	disabled: boolean | undefined;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	editorActions: EditorActions | undefined;
	editorDOMElement: ReactElement;
	editorView: EditorView;
	eventDispatcher: EventDispatcher | undefined;
	popupsMountPoint: HTMLElement | undefined;
	popupsBoundariesElement: HTMLElement | undefined;
	popupsScrollableElement: HTMLElement | undefined;
	providerFactory: ProviderFactory;
	wrapperElement: HTMLElement | null;
	hasHadInteraction?: boolean;
	featureFlags?: FeatureFlags;
	viewMode: ViewMode | undefined;
	isEditorToolbarHidden?: boolean;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
export const EDITOR_CONTAINER = 'ak-editor-container';

const scrollStyles = css(
	{
		flexGrow: 1,
		height: '100%',
		overflowY: 'scroll',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		scrollBehavior: 'smooth',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	scrollbarStyles,
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ScrollContainer = createEditorContentStyle(scrollStyles);
ScrollContainer.displayName = 'ScrollContainer';

const EditorContainer = componentWithCondition(
	() => editorExperiment('platform_editor_core_static_emotion', true, { exposure: true }),
	EditorContentContainer,
	ScrollContainer,
);

const Content = React.forwardRef<
	ScrollContainerRefs,
	FullPageEditorContentAreaProps & WrappedComponentProps
>((props, ref) => {
	const theme: Theme = useTheme();
	const fullWidthMode = props.appearance === 'full-width';
	const scrollContainerRef = useRef(null);
	const contentAreaRef = useRef(null);
	const containerRef = useRef(null);

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

	const shouldSetHiddenDataAttribute = () => {
		// When platform_editor_controls_performance_fixes is enabled we use a different method to
		// determine if the toolbar is hidden from outside of the editor, which doesn't require setting
		// data-editor-primary-toolbar-hidden on the content area
		// NOTE: When tidying, this function and the data attribute can be removed
		if (
			!props.isEditorToolbarHidden ||
			editorExperiment('platform_editor_controls_performance_fixes', true)
		) {
			return false;
		}

		return editorExperiment('platform_editor_controls', 'variant1');
	};

	return (
		<div
			css={
				expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true)
					? [
							contentAreaNew,
							fg('live_pages_content_jump_mitigation') && contentAreaHeightLivePageJumpMitigation,
							editorExperiment('platform_editor_controls', 'variant1', {
								exposure: true,
							}) && contentAreaHeightControls,
							props.isEditorToolbarHidden && contentAreaHeightNoToolbar,
						]
					: [
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							contentArea,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							props.isEditorToolbarHidden && contentAreaHeightNoToolbar,
						]
			}
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
				<EditorContainer
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="fabric-editor-popup-scroll-parent"
					featureFlags={props.featureFlags}
					ref={scrollContainerRef}
					viewMode={props?.viewMode}
					isScrollable
					appearance={props.appearance}
				>
					<ClickAreaBlock editorView={props.editorView} editorDisabled={props.disabled}>
						<div
							css={
								expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true)
									? [
											editorContentAreaNew,
											editorContentAreaProsemirrorStyle,
											tableFullPageEditorStylesNew,
											fg('live_pages_content_jump_mitigation') &&
												editorContentAreaNoToolbarLivePageJumpMitigation,
											editorExperiment('platform_editor_controls', 'variant1', {
												exposure: true,
											}) && editorContentAreaNoToolbarControls,
											fg('platform_editor_fix_table_width_inline_comment')
												? fullWidthNonChromelessBreakoutBlockTableStyle
												: fullWidthModeBreakoutBlockTableStyle,
											// for breakout resizing, there's no need to restrict the width of codeblocks as they're always wrapped in a breakout mark
											expValEqualsNoExposure(
												'platform_editor_breakout_resizing',
												'isEnabled',
												true,
											) && fg('platform_editor_breakout_resizing_width_changes')
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
										]
									: [
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
											...editorContentAreaStyle({
												fullWidthMode,
												layoutMaxWidth: theme.layoutMaxWidth,
												isEditorToolbarHidden: props.isEditorToolbarHidden,
											}),
										]
							}
							style={
								{
									'--ak-editor-content-area-max-width': !fullWidthMode
										? `${theme.layoutMaxWidth + getTotalPadding()}px`
										: `${akEditorFullWidthLayoutWidth + getTotalPadding()}px`,
								} as React.CSSProperties
							}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className="ak-editor-content-area-region"
							data-editor-editable-content
							data-editor-primary-toolbar-hidden={
								shouldSetHiddenDataAttribute() ? 'true' : undefined
							}
							role="region"
							aria-label={props.intl.formatMessage(messages.editableContentLabel)}
							ref={contentAreaRef}
						>
							<div
								css={
									expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true)
										? [
												editorContentGutterStyles,
												// eslint-disable-next-line @atlaskit/platform/no-preconditioning
												fg('platform_editor_controls_increase_full_page_gutter') &&
													editorExperiment('platform_editor_controls', 'variant1') &&
													editorContentGutterStyleFG,
											]
										: [
												// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
												editorContentGutterStyle(),
											]
								}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={
									fg('platform_editor_no_cursor_on_live_doc_init')
										? classnames('ak-editor-content-area', 'appearance-full-page', {
												'fabric-editor--full-width-mode': fullWidthMode,
											})
										: [
												'ak-editor-content-area',
												'appearance-full-page',
												fullWidthMode ? 'fabric-editor--full-width-mode' : '',
											].join(' ')
								}
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
							</div>
						</div>
					</ClickAreaBlock>
				</EditorContainer>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={sidebarArea}>
				{props.contextPanel || <ContextPanel editorAPI={props.editorAPI} visible={false} />}
			</div>
		</div>
	);
});

export const FullPageContentArea = injectIntl(Content, { forwardRef: true });
