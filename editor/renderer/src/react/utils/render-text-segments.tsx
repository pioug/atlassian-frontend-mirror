import React from 'react';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { TextSegment } from './segment-text';
import type { TextHighlighter } from '../types';

export function renderTextSegments(
	segments: Array<TextSegment>,
	textHighlighter: TextHighlighter | undefined,
	marksList: readonly Mark[],
	startPos: number,
) {
	const Component = textHighlighter?.component;
	const marks = new Set(marksList.map((m) => m.type.name));

	function renderSegment(segment: TextSegment, idx: number = 0) {
		if (segment.type === 'plain' || !Component) {
			return segment.text;
		}

		return (
			<span data-highlighted data-vc="highlighted-text">
				<Component
					match={segment.text}
					groups={segment.groups}
					marks={marks}
					key={`${segment.text}_${startPos}_${idx}`}
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
