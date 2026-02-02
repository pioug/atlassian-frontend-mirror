/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import React from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { abortAll } from '@atlaskit/react-ufo/interaction-metrics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import AnalyticsContext from '../../analytics/analyticsContext';
import { copyTextToClipboard } from '../utils/clipboard';
import type { NodeProps } from '../types';
import {
	type HeadingAnchorLinksProps,
	type HeadingAnchorLinksConfig,
} from '../../ui/Renderer/types';

import HeadingAnchor from './heading-anchor';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

const RENDERER_HEADING_WRAPPER = 'renderer-heading-wrapper';

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

function WrappedHeadingAnchor({
	enableNestedHeaderLinks,
	level,
	headingId,
	hideFromScreenReader,
}: {
	enableNestedHeaderLinks: boolean | undefined;
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
					onCopyText={() => {
						fireAnalyticsEvent({
							action: ACTION.CLICKED,
							actionSubject: ACTION_SUBJECT.BUTTON,
							actionSubjectId: ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
							eventType: EVENT_TYPE.UI,
						});

						return copyTextToClipboard(getCurrentUrlWithHash(headingId));
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
	const enableNestedHeaderLinks =
		allowHeadingAnchorLinks &&
		(allowHeadingAnchorLinks as HeadingAnchorLinksConfig).allowNestedHeaderLinks;

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
		<>
			<HX
				id={headingIdToUse}
				data-local-id={localId}
				data-renderer-start-pos={dataAttributes['data-renderer-start-pos']}
				data-as-inline={asInline}
				onMouseEnter={mouseEnterHandler}
			>
				<>
					{showAnchorLink && headingId && isRightAligned && (
						<WrappedHeadingAnchor
							level={props.level}
							enableNestedHeaderLinks={enableNestedHeaderLinks}
							headingId={headingId}
							hideFromScreenReader
						/>
					)}
					{props.children}
					{showAnchorLink && headingId && !isRightAligned && (
						<WrappedHeadingAnchor
							level={props.level}
							enableNestedHeaderLinks={enableNestedHeaderLinks}
							headingId={headingId}
							hideFromScreenReader
						/>
					)}
				</>
			</HX>
			<VisuallyHidden testId="visually-hidden-heading-anchor">
				{showAnchorLink && headingId && (
					<WrappedHeadingAnchor
						level={props.level}
						enableNestedHeaderLinks={enableNestedHeaderLinks}
						headingId={headingId}
					/>
				)}
			</VisuallyHidden>
		</>
	);
}

/**
 * New heading structure (a11y fix):
 * - Heading anchor is rendered OUTSIDE the heading element in a .renderer-heading-wrapper div
 * - Uses data-level attribute for CSS styling
 * - Better accessibility: heading contains only text, button is a sibling
 */
function HeadingWithWrapper(props: HeadingProps): React.JSX.Element {
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
	const enableNestedHeaderLinks =
		allowHeadingAnchorLinks &&
		(allowHeadingAnchorLinks as HeadingAnchorLinksConfig).allowNestedHeaderLinks;

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
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={RENDERER_HEADING_WRAPPER}
			data-testid={RENDERER_HEADING_WRAPPER}
			data-level={props.level}
			css={wrapperStyles}
		>
			{showAnchorLink && headingId && isRightAligned && (
				<WrappedHeadingAnchor
					level={props.level}
					enableNestedHeaderLinks={enableNestedHeaderLinks}
					headingId={headingId}
					hideFromScreenReader={false}
				/>
			)}
			<HX
				id={headingIdToUse}
				data-local-id={localId}
				data-renderer-start-pos={dataAttributes['data-renderer-start-pos']}
				data-as-inline={asInline}
				onMouseEnter={mouseEnterHandler}
			>
				{props.children}
			</HX>
			{showAnchorLink && headingId && !isRightAligned && (
				<WrappedHeadingAnchor
					level={props.level}
					enableNestedHeaderLinks={enableNestedHeaderLinks}
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
 * - Otherwise returns HeadingWithDuplicateAnchor (old structure)
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
	showAnchorLink,
	serializer,
	asInline,
}: HeadingProps): React.JSX.Element {
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
			>
				{children}
			</HeadingWithWrapper>
		);
	}

	return (
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
}

export default Heading;
