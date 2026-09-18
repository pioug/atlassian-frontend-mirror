/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import _uniqueId from 'lodash/uniqueId';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import {
	ExpandIconWrapper,
	ExpandLayoutWrapperWithRef,
	expandMessages,
	WidthProvider,
} from '@atlaskit/editor-common/ui';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorLineHeight,
	akEditorSwoopCubicBezier,
	akLayoutGutterOffset,
} from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { AnalyticsEventPayload } from '../analytics/events';
import { MODE, PLATFORM } from '../analytics/events';
import { ActiveHeaderIdConsumer } from './active-header-id-provider';
import type { RendererAppearance, RendererContentMode } from './Renderer/types';
import { ExpandBodyProvider, useExpandBody } from './utils/expand-body';

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
// When browser find is supported, the useEffect clears visibility:hidden after setting
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

// display:flow-root is applied only when browser find is not supported.
// It must NOT be set when browser find is supported — it overrides the
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

// When browser find is supported and expand is collapsed, we rely on the
// hidden="until-found" attribute on the outer container to hide content.
// We remove height:0/overflow:hidden/clip from the inner wrapper so the
// browser can actually search through the content.
//
// `user-select: none` must NOT be set here, unlike the variant above. WebKit scrolls to a
// find-in-page match by selecting it, so unselectable text is matched but never revealed: the
// reader is told there is a hit, the `hidden` attribute stays put, and the expand never opens.
// Chrome does not need a selection, so it hid the problem. Nothing is lost by leaving it out —
// content-visibility:hidden already makes a skipped subtree unselectable. It is only needed in the
// other variant, where the content is merely clipped and would otherwise be selectable.
const contentContainerStylesNotExpandedBrowserFind = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.expand-content-wrapper, .nestedExpand-content-wrapper': {
		width: '100%',
		display: 'block',
	},
});

const clearNextSiblingMarginTopStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& + *': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		marginTop: '0 !important',
	},
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
	localId?: string;
	nestedHeaderIds?: Array<string>;
	/**
	 * This expand's ProseMirror node. Passing it turns on lazy body loading: until the expand is
	 * first opened, the blocks the serializer wrapped show their text rather than rendering. After
	 * that they stay rendered, even if the reader closes the expand again (PGXT-9021). Leave it out
	 * to always render the body. Browsers without `hidden="until-found"` render it in full shortly
	 * after the page loads, since the text would not be findable there anyway.
	 */
	node?: PMNode;
	nodeType: 'expand' | 'nestedExpand';
	rendererAppearance?: RendererAppearance;
	rendererContentMode?: RendererContentMode;
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
	node,
}: ExpandProps & WrappedComponentProps) {
	const ancestorBody = useExpandBody();

	// Shared with every expand in the chain: the element that stood in for this expand and caught the
	// find sits under an expand further out, and by the time this one mounts that element is gone.
	//
	// Built on first render rather than passed to `useRef`, which would evaluate and discard a new set
	// on every render for the life of the expand.
	const ownRevealedByFind = useRef<WeakSet<PMNode> | null>(null);
	if (!ownRevealedByFind.current) {
		ownRevealedByFind.current = new WeakSet<PMNode>();
	}
	const revealedByFind = ancestorBody?.revealedByFind ?? ownRevealedByFind.current;
	/**
	 * Browser find matched inside this expand while the expand above it was still collapsed, so it
	 * opens as soon as it mounts — otherwise the reader would watch the outer expand open onto a
	 * closed one, with the match nowhere to be seen. Empty on the server and on the first client
	 * render, so hydration cannot disagree; only a find on the client ever puts anything in it.
	 */
	const revealedByFindOnMount = node !== undefined && revealedByFind.has(node);

	const [expanded, setExpanded] = useState(revealedByFindOnMount);
	const [focused, setFocused] = useState(false);
	/**
	 * PGXT-9021: once opened, the body stays rendered even if the reader closes the expand again.
	 * Throwing it away would re-run every macro and Forge fetch inside it on the next open, which is
	 * slower and visibly reloads content the reader has already seen. We only wanted to save work on
	 * the first page load, and by now that has happened. Starts false on both the server and the
	 * first client render, so hydration cannot disagree.
	 */
	const [hasBeenExpanded, setHasBeenExpanded] = useState(revealedByFindOnMount);

	const isMobile = false;
	const label = intl.formatMessage(
		expanded ? expandMessages.collapseNode : expandMessages.expandNode,
	);
	const { current: id } = useRef(_uniqueId('expand-title-'));
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const contentWrapperRef = useRef<HTMLDivElement>(null);

	const handleFocus = useCallback(() => setFocused(true), []);
	const handleBlur = useCallback(() => setFocused(false), []);
	// Both state updates happen in the same handler so they land in one render, rather than the
	// latch reacting to `expanded` from an effect.
	const openBody = useCallback(() => {
		setExpanded(true);
		setHasBeenExpanded(true);
	}, []);
	// The browser found the text inside this expand. Opening this one is not enough: if it sits
	// inside other expands, those have to open too or the reader still cannot see it. Each expand
	// asks the one above it, so a single match opens the whole chain and nothing else.
	const openWithAncestors = useCallback(() => {
		// Remembered before anything opens: a block above this expand may have been standing in for
		// itself, and rendering it rebuilds this expand. Without this it would come back closed over
		// the match the reader was just taken to.
		if (node) {
			revealedByFind.add(node);
		}
		openBody();
		ancestorBody?.openWithAncestors();
	}, [ancestorBody, node, openBody, revealedByFind]);

	// Feature-detect hidden="until-found" support via the beforematch event. Chrome 102+,
	// Firefox 139+ and Safari 26.2+ all have it; in a browser without it, hidden="until-found" is
	// treated as plain boolean hidden (display:none), which would break the expand entirely.
	// Starts as `undefined`, meaning "we do not know yet", and is only answered in an effect. We
	// cannot check during render: the server has no browser to check, so it would say no there and
	// yes on the client, and hydration would disagree.
	const [supportsHiddenUntilFound, setSupportsHiddenUntilFound] = useState<boolean | undefined>(
		undefined,
	);
	useEffect(() => {
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
	// Without it we skip this entirely and fall back to the normal CSS hiding
	// (visibility:hidden + height:0), which doesn't support find-in-page but still works
	// correctly for expand/collapse.
	useEffect(() => {
		const contentContainer = contentContainerRef.current;
		const contentWrapper = contentWrapperRef.current;
		if (!contentWrapper) {
			return;
		}

		if (supportsHiddenUntilFound && !expanded) {
			contentWrapper.setAttribute('hidden', 'until-found');
			// Products ship a CSS reset with `[hidden] { display: none }` — Confluence does. That is an
			// author rule, so it beats the UA stylesheet's
			// `[hidden="until-found"] { content-visibility: hidden }` and takes the content out of the
			// page altogether, where find cannot reach it. Setting display next to the attribute keeps
			// the two together, rather than relying on a class selector elsewhere out-weighing a reset
			// we do not own.
			contentWrapper.style.display = 'block';
			// Override the CSS visibility:hidden from contentContainerStyles — hidden="until-found"
			// now handles hiding via content-visibility:hidden, which allows browser find to index
			// the content. We use 'visible' (not '') because '' only clears the inline style but
			// the Emotion CSS class rule still applies visibility:hidden, blocking find-in-page.
			contentContainer?.style.setProperty('visibility', 'visible');
			contentWrapper.style.visibility = 'visible';
		} else {
			contentWrapper.removeAttribute('hidden');
			contentWrapper.style.display = '';
			contentContainer?.style.removeProperty('visibility');
			contentWrapper.style.visibility = '';
		}
	}, [expanded, supportsHiddenUntilFound]);

	useEffect(() => {
		if (expanded) {
			return;
		}

		const contentWrapper = contentWrapperRef.current;

		const unbindWrapperBeforeMatch =
			contentWrapper && supportsHiddenUntilFound
				? bind(contentWrapper, { type: 'beforematch', listener: openWithAncestors })
				: undefined;

		return () => {
			unbindWrapperBeforeMatch?.();
		};
	}, [expanded, openWithAncestors, supportsHiddenUntilFound]);

	// While this is false, the blocks of the body show their text instead of rendering. It is true
	// when:
	// - the expand is open, or has been opened before, so the reader wants to see the content;
	// - no node was given, so this expand never opted into lazy loading;
	// - the experiment is off;
	// - the browser has no hidden="until-found", so the text would not be findable and standing it in
	//   would gain nothing. While we still do not know, we assume the browser has it — assuming the
	//   opposite would render the whole body on the first paint and lose the saving entirely.
	const revealed =
		expanded ||
		hasBeenExpanded ||
		!node ||
		supportsHiddenUntilFound === false ||
		!isExperimentEnabled('platform_editor_defer_collapsed_expand_body');

	const expandBody = useMemo(
		() => ({ revealed, openWithAncestors, revealedByFind }),
		[revealed, openWithAncestors, revealedByFind],
	);

	const body = <ExpandBodyProvider value={expandBody}>{children}</ExpandBodyProvider>;

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
					onNestedHeaderIdMatch={openBody}
				/>
			) : null}
			<TitleContainer
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				onClick={(e: React.SyntheticEvent) => {
					e.preventDefault();
					e.stopPropagation();
					fireExpandToggleAnalytics(nodeType, expanded, fireAnalyticsEvent);
					if (expanded) {
						setExpanded(false);
					} else {
						openBody();
					}
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
				enableBrowserFind={supportsHiddenUntilFound}
				contentRef={contentContainerRef}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
				<div className={`${nodeType}-content-wrapper`} ref={contentWrapperRef}>
					{/*
					 * Nothing in a body that is standing in for itself is laid out — it is hidden until the
					 * reader or find opens the expand — so neither the width context nor the margin reset is
					 * of any use yet. Both cost real work: WidthProvider brings two divs, a ResizeObserver
					 * and an IntersectionObserver, which on a page of hundreds of expands is worth as much
					 * as holding the body back in the first place.
					 *
					 * React cannot add a DOM ancestor without rebuilding what is under it, so the blocks
					 * that do render while collapsed are rebuilt when the expand is first opened: a nested
					 * expand, which comes back open through `revealedByFind`, and an extension holding
					 * stashed ADF, whose nested renderer is mounted a second time.
					 */}
					{revealed ? (
						<WidthProvider>
							<div css={clearNextSiblingMarginTopStyle} />
							{body}
						</WidthProvider>
					) : (
						body
					)}
				</div>
			</ContentContainer>
		</Container>
	);
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<ExpandProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<ExpandProps & WrappedComponentProps>;
} = injectIntl(Expand);
export default _default_1;
