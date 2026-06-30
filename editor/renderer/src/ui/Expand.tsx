/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useCallback, useRef, Suspense, lazy } from 'react';
import { bind } from 'bind-event-listener';
import { getDocument } from '@atlaskit/browser-apis';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import {
	ExpandIconWrapper,
	ExpandLayoutWrapperWithRef,
	expandMessages,
	WidthProvider,
} from '@atlaskit/editor-common/ui';
import {
	akEditorLineHeight,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
} from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import _uniqueId from 'lodash/uniqueId';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { AnalyticsEventPayload } from '../analytics/events';
import { MODE, PLATFORM } from '../analytics/events';
import { ActiveHeaderIdConsumer } from './active-header-id-provider';
import type { RendererAppearance, RendererContentMode } from './Renderer/types';

type StyleProps = {
	children?: React.ReactNode;
	'data-node-type'?: 'expand' | 'nestedExpand';
	'data-title'?: string;
	expanded?: boolean;
	focused?: boolean;
};

type ContainerProps = StyleProps & {
	'data-expanded'?: boolean;
	'data-local-id'?: string;
	'data-testid'?: string;
};

const titleStyles = css({
	outline: 'none',
	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: `${14 / 16}rem`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
	lineHeight: akEditorLineHeight,
	fontWeight: token('font.weight.regular'),
	display: 'flex',
	flex: 1,
	margin: 0,
	padding: `0 0 0 ${token('space.050')}`,
	textAlign: 'left',
});

const titleStylesDense = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 'var(--ak-renderer-base-font-size)',
});

const containerStyles = css({
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: 'transparent',
	borderRadius: token('radius.small', '4px'),
	minHeight: '25px',
	background: token('color.background.neutral.subtle'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `background 0.3s ${akEditorSwoopCubicBezier}, border-color 0.3s ${akEditorSwoopCubicBezier}`,
	padding: token('space.0'),
	paddingBottom: token('space.0'),
	marginTop: token('space.050'),
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'td > :not(style):first-child, td > style:first-child + *': {
		marginTop: 0,
	},
});

const containerStylesExpanded = css({
	background: token('elevation.surface'),
	paddingBottom: token('space.100'),
	borderColor: token('color.border'),
});

const containerStylesFocused = css({
	borderColor: token('color.border.focused'),
});

const containerStylesDataNodeTypeExpand = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	marginLeft: `-${akLayoutGutterOffset}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	marginRight: `-${akLayoutGutterOffset}px`,
});

const titleContainerStyles = css({
	display: 'flex',
	alignItems: 'flex-start',
	background: 'none',
	border: 'none',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: `${14 / 16}rem`,
	width: '100%',
	color: token('color.text.subtle'),
	overflow: 'hidden',
	cursor: 'pointer',
	padding: token('space.100'),
	'&:focus': {
		outline: 0,
	},
});

const titleContainerStylesExpanded = css({
	paddingBottom: token('space.0'),
});

// Base styles for the content container. visibility:hidden hides collapsed content.
// When browser find is enabled, the useEffect clears visibility:hidden after setting
// hidden="until-found" on the DOM element, which applies content-visibility:hidden natively —
// this hides the content while allowing browser Ctrl+F to index the text.
// The visibility:hidden in CSS serves as an SSR fallback (useEffect doesn't run server-side).
const contentContainerStyles = css({
	paddingTop: token('space.0'),
	marginLeft: token('space.050'),
	paddingRight: token('space.200'),
	paddingLeft: token('space.400'),
	visibility: 'hidden',

	// The follow rules inside @supports block are added as a part of ED-8893
	// The fix is targeting mobile bridge on iOS 12 or below,
	// We should consider remove this fix when we no longer support iOS 12
	'@supports not (display: flow-root)': {
		width: '100%',
		boxSizing: 'border-box',
	},
});

// display:flow-root is applied only when browser find is NOT enabled.
// It must NOT be set when browser find is enabled — it overrides the
// content-visibility:hidden applied by hidden="until-found" and makes content visible.
const contentContainerStylesFlowRoot = css({
	display: 'flow-root',
});

const contentContainerStylesExpanded = css({
	paddingTop: token('space.100'),
	visibility: 'visible',
});

const contentContainerStylesNotExpanded = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.expand-content-wrapper, .nestedExpand-content-wrapper': {
		/* We visually hide the content here to preserve the content during copy+paste */
		/* Do not add text nowrap here because inline comment navigation depends on the location of the text */
		width: '100%',
		display: 'block',
		height: 0,
		overflow: 'hidden',
		clip: 'rect(1px, 1px, 1px, 1px)',
		userSelect: 'none',
	},
});

// When browser find is enabled and expand is collapsed, we rely on the
// hidden="until-found" attribute on the outer container to hide content.
// We remove height:0/overflow:hidden/clip from the inner wrapper so the
// browser can actually search through the content.
const contentContainerStylesNotExpandedBrowserFind = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.expand-content-wrapper, .nestedExpand-content-wrapper': {
		width: '100%',
		display: 'block',
		userSelect: 'none',
	},
});

const clearNextSiblingMarginTopStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& + *': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
});

// Lazy-loaded children component
const LazyChildren = lazy(() => {
	return Promise.resolve({
		default: ({ children }: { children: React.ReactNode }) => {
			return React.createElement(React.Fragment, null, children);
		},
	});
});

const Container = (props: ContainerProps) => {
	return (
		<div
			css={[
				containerStyles,
				props['data-node-type'] === 'expand' && containerStylesDataNodeTypeExpand,
				props.expanded && containerStylesExpanded,
				props.focused && containerStylesFocused,
			]}
			data-testid={props['data-testid']}
			data-node-type={props['data-node-type']}
			data-title={props['data-title']}
			data-expanded={props['data-expanded']}
			data-local-id={props['data-local-id']}
		>
			{props.children}
		</div>
	);
};

const TitleContainer = (props: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { expanded } = props;

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			css={[titleContainerStyles, expanded && titleContainerStylesExpanded]}
			onClick={props.onClick}
			onFocus={props.onFocus}
			onBlur={props.onBlur}
			aria-labelledby={props['aria-labelledby']}
			aria-expanded={props['aria-expanded']}
			contentEditable={props.contentEditable}
		>
			{props.children}
		</button>
	);
};

TitleContainer.displayName = 'TitleContainerButton';

type ContentContainerProps = StyleProps & {
	contentRef?: React.Ref<HTMLDivElement>;
	enableBrowserFind?: boolean;
};

const ContentContainer = (props: ContentContainerProps) => {
	return (
		<div
			ref={props.contentRef}
			css={[
				contentContainerStyles,
				!props.enableBrowserFind && contentContainerStylesFlowRoot,
				props.expanded && contentContainerStylesExpanded,
				!props.expanded &&
					(props.enableBrowserFind
						? contentContainerStylesNotExpandedBrowserFind
						: contentContainerStylesNotExpanded),
			]}
		>
			{props.children}
		</div>
	);
};

export interface ExpandProps {
	children: React.ReactNode;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	loadBodyContent?: boolean;
	localId?: string;
	nestedHeaderIds?: Array<string>;
	nodeType: 'expand' | 'nestedExpand';
	rendererAppearance?: RendererAppearance;
	rendererContentMode?: RendererContentMode;
	searchText?: string;
	title: string;
}

function fireExpandToggleAnalytics(
	nodeType: ExpandProps['nodeType'],
	expanded: boolean,
	fireAnalyticsEvent: ExpandProps['fireAnalyticsEvent'],
) {
	if (!fireAnalyticsEvent) {
		return;
	}

	fireAnalyticsEvent({
		action: ACTION.TOGGLE_EXPAND,
		actionSubject: nodeType === 'expand' ? ACTION_SUBJECT.EXPAND : ACTION_SUBJECT.NESTED_EXPAND,
		attributes: {
			platform: PLATFORM.WEB,
			mode: MODE.RENDERER,
			expanded: !expanded,
		},
		eventType: EVENT_TYPE.TRACK,
	});
}

function Expand({
	title,
	children,
	nodeType,
	intl,
	fireAnalyticsEvent,
	localId,
	nestedHeaderIds,
	rendererContentMode,
	loadBodyContent,
	searchText,
}: ExpandProps & WrappedComponentProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [focused, setFocused] = React.useState(false);
	const [hasLoadedChildren, setHasLoadedChildren] = React.useState(false);

	const isMobile = false;
	const label = intl.formatMessage(
		expanded ? expandMessages.collapseNode : expandMessages.expandNode,
	);
	const { current: id } = useRef(_uniqueId('expand-title-'));
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const contentWrapperRef = useRef<HTMLDivElement>(null);

	const handleFocus = useCallback(() => setFocused(true), []);
	const handleBlur = useCallback(() => setFocused(false), []);
	const expandForBrowserFind = useCallback(() => {
		setHasLoadedChildren(true);
		setExpanded(true);
	}, []);

	const shouldRenderLazyChildren = hasLoadedChildren || loadBodyContent;
	// Only render the lightweight text placeholder when lazy load is ON and
	// children haven't been loaded yet. When lazy load is OFF, children are
	// always in the DOM — hidden="until-found" on the wrapper already makes
	// them searchable by browser find, so no placeholder is needed.
	const shouldRenderBrowserFindText =
		!shouldRenderLazyChildren &&
		searchText &&
		fg('hot-121622_lazy_load_expand_content') &&
		expValEquals('platform_editor_close_expand_find', 'isEnabled', true);

	// Feature-detect hidden="until-found" support via the beforematch event.
	// Chrome 102+ and Firefox 130+ support it; Safari does not yet.
	// In unsupported browsers, setting hidden="until-found" is treated as boolean hidden
	// (display:none), which would break the expand entirely.
	// Initialised as false and set in useEffect to avoid SSR/client hydration mismatch —
	// useMemo would return true on the client's first render in supported browsers,
	// differing from the server snapshot which always produces false.
	const [supportsHiddenUntilFound, setSupportsHiddenUntilFound] = React.useState(false);
	React.useEffect(() => {
		const doc = getDocument();
		setSupportsHiddenUntilFound(doc?.body ? 'onbeforematch' in doc.body : false);
	}, []);

	// React 18 treats `hidden` as a boolean attribute and strips the "until-found" value,
	// rendering it as just `hidden` (which applies display:none and blocks find-in-page).
	// We bypass React by setting the attribute directly on the DOM element around the text.
	//
	// We also remove the CSS visibility:hidden (SSR fallback) once hidden="until-found" is set,
	// because visibility:hidden blocks browser find. On expanded, we restore visibility to visible.
	//
	// Only applied when the browser supports hidden="until-found" (detected via onbeforematch).
	// In unsupported browsers (Safari), we skip this entirely and fall back to the normal
	// CSS hiding (visibility:hidden + height:0), which doesn't support find-in-page but
	// still works correctly for expand/collapse.
	React.useEffect(() => {
		const contentContainer = contentContainerRef.current;
		const contentWrapper = contentWrapperRef.current;
		if (!contentWrapper) {
			return;
		}

		if (
			supportsHiddenUntilFound &&
			expValEquals('platform_editor_close_expand_find', 'isEnabled', true) &&
			!expanded
		) {
			contentWrapper.setAttribute('hidden', 'until-found');
			// Override the CSS visibility:hidden from contentContainerStyles — hidden="until-found"
			// now handles hiding via content-visibility:hidden, which allows browser find to index
			// the content. We use 'visible' (not '') because '' only clears the inline style but
			// the Emotion CSS class rule still applies visibility:hidden, blocking find-in-page.
			contentContainer?.style.setProperty('visibility', 'visible');
			contentWrapper.style.visibility = 'visible';
		} else {
			contentWrapper.removeAttribute('hidden');
			contentContainer?.style.removeProperty('visibility');
			contentWrapper.style.visibility = '';
		}
	}, [expanded, supportsHiddenUntilFound]);

	React.useEffect(() => {
		if (!expValEquals('platform_editor_close_expand_find', 'isEnabled', true) || expanded) {
			return;
		}

		const contentWrapper = contentWrapperRef.current;

		const unbindWrapperBeforeMatch =
			contentWrapper && supportsHiddenUntilFound
				? bind(contentWrapper, { type: 'beforematch', listener: expandForBrowserFind })
				: undefined;

		return () => {
			unbindWrapperBeforeMatch?.();
		};
	}, [expandForBrowserFind, expanded, supportsHiddenUntilFound]);

	let expandContent = children;
	if (shouldRenderBrowserFindText) {
		// Browser find path: keep a lightweight text mirror in the closed expand
		// so Ctrl+F can index it without mounting the rich children tree.
		expandContent = <span>{searchText}</span>;
	} else if (!shouldRenderLazyChildren && fg('hot-121622_lazy_load_expand_content')) {
		expandContent = null;
	} else if (fg('hot-121622_lazy_load_expand_content')) {
		expandContent = (
			<Suspense fallback={<div>{intl.formatMessage(expandMessages.loading)}</div>}>
				<LazyChildren>{children}</LazyChildren>
			</Suspense>
		);
	}

	return (
		<Container
			data-testid={`expand-container-${nodeType}-${id}`}
			data-node-type={nodeType}
			data-title={title}
			data-expanded={expanded}
			data-local-id={localId}
			expanded={expanded}
			focused={focused}
		>
			{nestedHeaderIds && nestedHeaderIds.length > 0 ? (
				<ActiveHeaderIdConsumer
					nestedHeaderIds={nestedHeaderIds}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					onNestedHeaderIdMatch={() => {
						if (!hasLoadedChildren) {
							setHasLoadedChildren(true);
						}
						setExpanded(true);
					}}
				/>
			) : null}
			<TitleContainer
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				onClick={(e: React.SyntheticEvent) => {
					e.preventDefault();
					e.stopPropagation();
					fireExpandToggleAnalytics(nodeType, expanded, fireAnalyticsEvent);

					// Mark children as loaded when expanding for the first time
					if (!expanded && !hasLoadedChildren) {
						setHasLoadedChildren(true);
					}

					setExpanded(!expanded);
					e.persist();
					// @ts-ignore detail doesn't exist on type
					e.detail ? handleBlur() : handleFocus();
				}}
				onFocus={handleFocus}
				onBlur={handleBlur}
				aria-labelledby={id}
				aria-expanded={expanded}
				contentEditable={false}
				expanded={expanded}
			>
				{isMobile ? (
					<ExpandIconWrapper expanded={expanded}>
						<ChevronRightIcon label={label} spacing="spacious" size="small" />
					</ExpandIconWrapper>
				) : (
					<Tooltip
						content={label}
						position="top"
						// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
						tag={ExpandLayoutWrapperWithRef}
						testId={'tooltip'}
					>
						<ExpandIconWrapper expanded={expanded}>
							<ChevronRightIcon label={label} spacing="spacious" size="small" />
						</ExpandIconWrapper>
					</Tooltip>
				)}
				<span css={[titleStyles, rendererContentMode === 'compact' && titleStylesDense]} id={id}>
					{title || intl.formatMessage(expandMessages.expandDefaultTitle)}
				</span>
			</TitleContainer>
			<ContentContainer
				expanded={expanded}
				enableBrowserFind={
					supportsHiddenUntilFound &&
					expValEquals('platform_editor_close_expand_find', 'isEnabled', true)
				}
				contentRef={contentContainerRef}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className={`${nodeType}-content-wrapper`} ref={contentWrapperRef}>
					<WidthProvider>
						<div css={clearNextSiblingMarginTopStyle} />
						{expandContent}
					</WidthProvider>
				</div>
			</ContentContainer>
		</Container>
	);
}

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<ExpandProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<ExpandProps & WrappedComponentProps>;
} = injectIntl(Expand);
export default _default_1;
