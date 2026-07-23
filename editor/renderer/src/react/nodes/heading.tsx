/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { useIntl } from 'react-intl';

import { css, jsx } from '@atlaskit/css';
import { IconButton } from '@atlaskit/button/new';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { abortAll } from '@atlaskit/react-ufo/interaction-metrics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import AnalyticsContext from '../../analytics/analyticsContext';
import { copyTextToClipboard } from '../utils/clipboard';
import type { NodeProps } from '../types';
import type { HeadingAnchorLinksProps } from '../../ui/Renderer/types';
import { collapsibleHeadingMessages } from '../../messages';
import { useCollapsibleHeading } from '../../ui/collapsible-headings';

import HeadingAnchor from './heading-anchor';

export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

const RENDERER_HEADING_WRAPPER = 'renderer-heading-wrapper';
const RENDERER_COLLAPSIBLE_HEADING_WRAPPER = 'renderer-collapsible-heading-wrapper';

const getCurrentUrlWithHash = (hash: string = ''): string => {
	const url = new URL(window.location.href);
	url.search = ''; // clear any query params so that the page will correctly scroll to the anchor
	url.hash = encodeURIComponent(hash);
	return url.href;
};

function hasRightAlignmentMark(marks?: PMNode['marks']) {
	if (!marks || !marks.length) {
		return false;
	}
	return marks.some((mark) => mark.type.name === 'alignment' && mark.attrs.align === 'end');
}

const wrapperStyles = css({
	// Important: do NOT use flex here.
	// With flex + baseline alignment, the anchor aligns to the *first line* of a multi-line heading,
	// which visually places it at the top-right. We want the anchor to sit immediately after the
	// last character of the heading (i.e. after the final wrapped line), so we use normal inline flow.
	display: 'block',
});

const collapsibleHeadingWrapperStyles = css({
	// Include the chevron gutter in the wrapper's hit area while keeping heading text aligned with
	// non-collapsible renderer content. This prevents the hover control disappearing while the
	// pointer crosses from the heading to the button.
	marginInlineStart: token('space.negative.400'),
	paddingInlineStart: token('space.400'),
	position: 'relative',
});

const collapsibleHeadingButtonStyles = css({
	position: 'absolute',
	insetBlockStart: 0,
	insetInlineStart: 0,
	zIndex: 1,
});

const collapsibleHeadingButtonHiddenStyles = css({
	opacity: 0,
	pointerEvents: 'none',
	'@media (hover: none)': {
		opacity: 1,
		pointerEvents: 'auto',
	},
	'@media (pointer: coarse)': {
		opacity: 1,
		pointerEvents: 'auto',
	},
});

const ChevronDownSmallIcon = () => <ChevronDownIcon label="" size="small" />;
const ChevronRightSmallIcon = () => <ChevronRightIcon label="" size="small" />;

const hasFocusVisible = (target: HTMLElement): boolean => {
	try {
		return target.matches(':focus-visible');
	} catch {
		return true;
	}
};

const getHeadingAnchorLinksConfig = (
	allowHeadingAnchorLinks: HeadingProps['allowHeadingAnchorLinks'],
) => (typeof allowHeadingAnchorLinks === 'object' ? allowHeadingAnchorLinks : undefined);

function WrappedHeadingAnchor({
	enableNestedHeaderLinks,
	getHeadingLink,
	level,
	headingId,
	hideFromScreenReader,
}: {
	enableNestedHeaderLinks: boolean | undefined;
	getHeadingLink?: (headingId: string) => string;
	headingId: string;
	hideFromScreenReader?: boolean;
	level: number;
}) {
	return (
		<AnalyticsContext.Consumer>
			{({ fireAnalyticsEvent }) => (
				<HeadingAnchor
					enableNestedHeaderLinks={enableNestedHeaderLinks}
					level={level}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					onCopyText={() => {
						fireAnalyticsEvent({
							action: ACTION.CLICKED,
							actionSubject: ACTION_SUBJECT.BUTTON,
							actionSubjectId: ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
							eventType: EVENT_TYPE.UI,
						});

						return copyTextToClipboard(
							getHeadingLink?.(headingId) ?? getCurrentUrlWithHash(headingId),
						);
					}}
					hideFromScreenReader={hideFromScreenReader}
					headingId={headingId}
				/>
			)}
		</AnalyticsContext.Consumer>
	);
}

type HeadingProps = NodeProps<{
	allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	headingId?: string;
	invisible?: boolean;
	level: HeadingLevels;
	localId?: string;
	marks?: PMNode['marks'];
	showAnchorLink?: boolean;
}>;

type CollapsibleHeadingState = NonNullable<ReturnType<typeof useCollapsibleHeading>>;

function CollapsibleHeadingButton({
	collapsibleHeading,
	isHeadingHovered,
}: {
	collapsibleHeading: CollapsibleHeadingState;
	isHeadingHovered: boolean;
}) {
	const intl = useIntl();
	const [isFocused, setIsFocused] = React.useState(false);
	const { isCollapsed, toggle } = collapsibleHeading;
	const isVisible = isCollapsed || isFocused || isHeadingHovered;
	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			toggle();
		},
		[toggle],
	);
	const handleFocus = React.useCallback((event: React.FocusEvent<HTMLElement>) => {
		setIsFocused(hasFocusVisible(event.target));
	}, []);
	const handleBlur = React.useCallback(() => setIsFocused(false), []);
	const handleKeyDown = React.useCallback(() => setIsFocused(true), []);

	return (
		<span
			css={[collapsibleHeadingButtonStyles, !isVisible && collapsibleHeadingButtonHiddenStyles]}
		>
			<IconButton
				appearance="subtle"
				spacing="compact"
				icon={isCollapsed ? ChevronRightSmallIcon : ChevronDownSmallIcon}
				label={intl.formatMessage(
					isCollapsed
						? collapsibleHeadingMessages.expandSection
						: collapsibleHeadingMessages.collapseSection,
				)}
				aria-expanded={!isCollapsed}
				isTooltipDisabled={false}
				testId="collapsible-heading-button"
				onClick={handleClick}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
		</span>
	);
}

function CollapsibleHeadingContainer({
	children,
	collapsibleHeading,
	headingLevel,
}: {
	children: React.ReactNode;
	collapsibleHeading: CollapsibleHeadingState;
	headingLevel: HeadingLevels;
}): React.JSX.Element {
	const mouseEntered = React.useRef(false);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isFocused, setIsFocused] = React.useState(false);

	const mouseEnterHandler = () => {
		if (!mouseEntered.current) {
			abortAll('new_interaction');
			mouseEntered.current = true;
		}
	};

	return (
		<div
			data-testid={RENDERER_COLLAPSIBLE_HEADING_WRAPPER}
			data-level={headingLevel}
			css={collapsibleHeadingWrapperStyles}
			onMouseEnter={() => {
				mouseEnterHandler();
				setIsHovered(true);
			}}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={(event) => setIsFocused(hasFocusVisible(event.target))}
			onBlur={() => setIsFocused(false)}
		>
			<CollapsibleHeadingButton
				collapsibleHeading={collapsibleHeading}
				isHeadingHovered={isHovered || isFocused}
			/>
			{children}
		</div>
	);
}

/**
 * Old heading structure (before a11y fix):
 * - headning anchor is rendered INSIDE the heading element
 * - A duplicate anchor is rendered in VisuallyHidden for screen readers
 * - The visible button has hideFromScreenReader={true}
 *
 */
function HeadingWithDuplicateAnchor(props: HeadingProps): React.JSX.Element {
	const {
		headingId,
		dataAttributes,
		allowHeadingAnchorLinks,
		marks,
		invisible,
		localId,
		asInline,
	} = props;
	const HX = `h${props.level}` as 'h1';
	const mouseEntered = React.useRef(false);
	const showAnchorLink = !!props.showAnchorLink;
	const isRightAligned = hasRightAlignmentMark(marks);
	const headingAnchorLinksConfig = getHeadingAnchorLinksConfig(allowHeadingAnchorLinks);
	const enableNestedHeaderLinks = headingAnchorLinksConfig?.allowNestedHeaderLinks;
	const getHeadingLink = headingAnchorLinksConfig?.getHeadingLink;

	const headingIdToUse = invisible ? undefined : headingId;

	const mouseEnterHandler = () => {
		if (showAnchorLink && !mouseEntered.current) {
			// Abort TTVC calculation when the mouse hovers over heading. Hovering over
			// heading render heading anchor and inline comment buttons. These user-induced
			// DOM changes are valid reasons to abort the TTVC calculation.
			abortAll('new_interaction');
			mouseEntered.current = true;
		}
	};

	return (
		<React.Fragment>
			<HX
				id={headingIdToUse}
				data-local-id={localId}
				data-renderer-start-pos={dataAttributes['data-renderer-start-pos']}
				data-as-inline={asInline}
				onMouseEnter={mouseEnterHandler}
				tabIndex={-1}
			>
				<React.Fragment>
					{showAnchorLink && headingId && isRightAligned && (
						<WrappedHeadingAnchor
							level={props.level}
							enableNestedHeaderLinks={enableNestedHeaderLinks}
							getHeadingLink={getHeadingLink}
							headingId={headingId}
							hideFromScreenReader
						/>
					)}
					{props.children}
					{showAnchorLink && headingId && !isRightAligned && (
						<WrappedHeadingAnchor
							level={props.level}
							enableNestedHeaderLinks={enableNestedHeaderLinks}
							getHeadingLink={getHeadingLink}
							headingId={headingId}
							hideFromScreenReader
						/>
					)}
				</React.Fragment>
			</HX>
			<VisuallyHidden testId="visually-hidden-heading-anchor">
				{showAnchorLink && headingId && (
					<WrappedHeadingAnchor
						level={props.level}
						enableNestedHeaderLinks={enableNestedHeaderLinks}
						getHeadingLink={getHeadingLink}
						headingId={headingId}
					/>
				)}
			</VisuallyHidden>
		</React.Fragment>
	);
}

/**
 * New heading structure (a11y fix):
 * - Heading anchor is rendered OUTSIDE the heading element in a .renderer-heading-wrapper div
 * - Uses data-level attribute for CSS styling
 * - Better accessibility: heading contains only text, button is a sibling
 */
function HeadingWithWrapper(
	props: HeadingProps & { collapsibleHeading: CollapsibleHeadingState | null },
): React.JSX.Element {
	const {
		headingId,
		dataAttributes,
		allowHeadingAnchorLinks,
		marks,
		invisible,
		localId,
		asInline,
		collapsibleHeading,
	} = props;
	const HX = `h${props.level}` as 'h1';
	const mouseEntered = React.useRef(false);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isFocused, setIsFocused] = React.useState(false);
	const showAnchorLink = !!props.showAnchorLink;
	const isRightAligned = hasRightAlignmentMark(marks);
	const headingAnchorLinksConfig = getHeadingAnchorLinksConfig(allowHeadingAnchorLinks);
	const enableNestedHeaderLinks = headingAnchorLinksConfig?.allowNestedHeaderLinks;
	const getHeadingLink = headingAnchorLinksConfig?.getHeadingLink;

	const headingIdToUse = invisible ? undefined : headingId;

	const mouseEnterHandler = () => {
		if ((showAnchorLink || collapsibleHeading) && !mouseEntered.current) {
			// Abort TTVC calculation when the mouse hovers over heading. Hovering over
			// heading render heading anchor and inline comment buttons. These user-induced
			// DOM changes are valid reasons to abort the TTVC calculation.
			abortAll('new_interaction');
			mouseEntered.current = true;
		}
	};
	const handleWrapperMouseEnter = () => {
		mouseEnterHandler();
		setIsHovered(true);
	};
	const handleWrapperMouseLeave = () => setIsHovered(false);
	const handleWrapperFocus = (event: React.FocusEvent<HTMLDivElement>) =>
		setIsFocused(hasFocusVisible(event.target));
	const handleWrapperBlur = () => setIsFocused(false);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={RENDERER_HEADING_WRAPPER}
			data-testid={RENDERER_HEADING_WRAPPER}
			data-level={props.level}
			css={[wrapperStyles, collapsibleHeading && collapsibleHeadingWrapperStyles]}
			onMouseEnter={collapsibleHeading ? handleWrapperMouseEnter : undefined}
			onMouseLeave={collapsibleHeading ? handleWrapperMouseLeave : undefined}
			onFocus={collapsibleHeading ? handleWrapperFocus : undefined}
			onBlur={collapsibleHeading ? handleWrapperBlur : undefined}
		>
			{collapsibleHeading && (
				<CollapsibleHeadingButton
					collapsibleHeading={collapsibleHeading}
					isHeadingHovered={isHovered || isFocused}
				/>
			)}
			{showAnchorLink && headingId && isRightAligned && (
				<WrappedHeadingAnchor
					level={props.level}
					enableNestedHeaderLinks={enableNestedHeaderLinks}
					getHeadingLink={getHeadingLink}
					headingId={headingId}
					hideFromScreenReader={false}
				/>
			)}
			<HX
				id={headingIdToUse}
				data-local-id={localId}
				data-renderer-start-pos={dataAttributes['data-renderer-start-pos']}
				data-as-inline={asInline}
				onMouseEnter={collapsibleHeading ? undefined : mouseEnterHandler}
				tabIndex={-1}
			>
				{props.children}
			</HX>
			{showAnchorLink && headingId && !isRightAligned && (
				<WrappedHeadingAnchor
					level={props.level}
					enableNestedHeaderLinks={enableNestedHeaderLinks}
					getHeadingLink={getHeadingLink}
					headingId={headingId}
					hideFromScreenReader={false}
				/>
			)}
		</div>
	);
}

/**
 * Gated Heading component:
 * - When platform_editor_copy_link_a11y_inconsistency_fix experiment is enabled,
 *   returns HeadingWithWrapper (new a11y-improved structure)
 * - Otherwise preserves HeadingWithDuplicateAnchor (old structure), adding only the collapse
 *   container when the top-level heading is collapsible
 */
function Heading({
	allowHeadingAnchorLinks,
	children,
	dataAttributes,
	headingId,
	invisible,
	level,
	localId,
	marks,
	nodeType,
	path,
	showAnchorLink,
	serializer,
	asInline,
}: HeadingProps): React.JSX.Element {
	const collapsibleHeading = useCollapsibleHeading(
		dataAttributes['data-renderer-start-pos'],
		path?.length === 0,
	);
	if (expValEquals('platform_editor_copy_link_a11y_inconsistency_fix', 'isEnabled', true)) {
		return (
			<HeadingWithWrapper
				allowHeadingAnchorLinks={allowHeadingAnchorLinks}
				dataAttributes={dataAttributes}
				headingId={headingId}
				invisible={invisible}
				level={level}
				localId={localId}
				marks={marks}
				nodeType={nodeType}
				serializer={serializer}
				showAnchorLink={showAnchorLink}
				asInline={asInline}
				collapsibleHeading={collapsibleHeading}
			>
				{children}
			</HeadingWithWrapper>
		);
	}

	const headingWithDuplicateAnchor = (
		<HeadingWithDuplicateAnchor
			allowHeadingAnchorLinks={allowHeadingAnchorLinks}
			dataAttributes={dataAttributes}
			headingId={headingId}
			invisible={invisible}
			level={level}
			localId={localId}
			marks={marks}
			nodeType={nodeType}
			serializer={serializer}
			showAnchorLink={showAnchorLink}
			asInline={asInline}
		>
			{children}
		</HeadingWithDuplicateAnchor>
	);

	if (collapsibleHeading) {
		return (
			<CollapsibleHeadingContainer collapsibleHeading={collapsibleHeading} headingLevel={level}>
				{headingWithDuplicateAnchor}
			</CollapsibleHeadingContainer>
		);
	}

	return headingWithDuplicateAnchor;
}

export default Heading;
