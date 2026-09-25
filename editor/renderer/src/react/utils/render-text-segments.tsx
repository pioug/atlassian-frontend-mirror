import React from 'react';

import type { Mark } from '@atlaskit/editor-prosemirror/model';

import type { TextHighlighter } from '../types';
import type { TextSegment } from './segment-text';

/** Collects the mark type names a highlighter component receives for a text node. */
const toMarkNames = (marksList: readonly Mark[]): Set<string> =>
	new Set(marksList.map((m) => m.type.name));

export function renderTextSegments(
	segments: Array<TextSegment>,
	textHighlighter: TextHighlighter | undefined,
	marksList: readonly Mark[],
	startPos: number,
	lazyMarks: boolean = false,
): string | React.JSX.Element {
	const Component = textHighlighter?.component;
	// With `lazyMarks`, the Set is only built once a highlighted segment is actually rendered, so
	// a highlighter with no matches on this text allocates nothing extra.
	let marks: Set<string> | undefined = lazyMarks ? undefined : toMarkNames(marksList);

	function renderSegment(segment: TextSegment, idx: number = 0) {
		if (segment.type === 'plain' || !Component) {
			return segment.text;
		}

		if (!marks) {
			marks = toMarkNames(marksList);
		}

		return (
			<span data-highlighted data-vc="highlighted-text" key={`${segment.text}_${startPos}_${idx}`}>
				<Component
					match={segment.text}
					groups={segment.groups}
					marks={marks}
					startPos={startPos + idx}
				>
					{segment.text}
				</Component>
			</span>
		);
	}

	if (segments.length === 1) {
		return renderSegment(segments[0]);
	}

	return (
		<React.Fragment key={`text-wrapper_${startPos}`}>{segments.map(renderSegment)}</React.Fragment>
	);
}
