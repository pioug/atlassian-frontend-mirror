import React from 'react';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import HeadingAnchor from './heading-anchor';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import AnalyticsContext from '../../analytics/analyticsContext';
import { copyTextToClipboard } from '../utils/clipboard';
import { type NodeProps } from '../types';
import {
	type HeadingAnchorLinksProps,
	type HeadingAnchorLinksConfig,
} from '../../ui/Renderer/types';

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
}: {
	enableNestedHeaderLinks: boolean | undefined;
	level: number;
	headingId: string;
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
				/>
			)}
		</AnalyticsContext.Consumer>
	);
}

function Heading(
	props: NodeProps<{
		level: HeadingLevels;
		headingId?: string;
		showAnchorLink?: boolean;
		allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
		marks?: PMNode['marks'];
		invisible?: boolean;
	}>,
) {
	const { headingId, dataAttributes, allowHeadingAnchorLinks, marks, invisible } = props;
	const HX = `h${props.level}` as 'h1';

	const showAnchorLink = !!props.showAnchorLink;
	const isRightAligned = hasRightAlignmentMark(marks);
	const enableNestedHeaderLinks =
		allowHeadingAnchorLinks &&
		(allowHeadingAnchorLinks as HeadingAnchorLinksConfig).allowNestedHeaderLinks;

	const headingIdToUse = invisible ? undefined : headingId;
	return (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		<HX id={headingIdToUse} {...dataAttributes}>
			<>
				{showAnchorLink && headingId && isRightAligned && (
					<WrappedHeadingAnchor
						level={props.level}
						enableNestedHeaderLinks={enableNestedHeaderLinks}
						headingId={headingId}
					/>
				)}
				{props.children}
				{showAnchorLink && headingId && !isRightAligned && (
					<WrappedHeadingAnchor
						level={props.level}
						enableNestedHeaderLinks={enableNestedHeaderLinks}
						headingId={headingId}
					/>
				)}
			</>
		</HX>
	);
}

export default Heading;
