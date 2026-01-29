import React from 'react';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { abortAll } from '@atlaskit/react-ufo/interaction-metrics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import AnalyticsContext from '../../analytics/analyticsContext';
import { copyTextToClipboard } from '../utils/clipboard';
import type { NodeProps } from '../types';
import {
	type HeadingAnchorLinksProps,
	type HeadingAnchorLinksConfig,
} from '../../ui/Renderer/types';

import HeadingAnchor from './heading-anchor';

export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

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

function Heading(
	props: NodeProps<{
		allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
		headingId?: string;
		invisible?: boolean;
		level: HeadingLevels;
		localId?: string;
		marks?: PMNode['marks'];
		showAnchorLink?: boolean;
	}>,
): React.JSX.Element {
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

export default Heading;
