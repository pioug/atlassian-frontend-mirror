import type React from 'react';

import type { Mark } from '@atlaskit/editor-prosemirror/model';

import type { TextHighlighter } from '../types';
import { renderTextSegments } from './render-text-segments';
import { segmentText } from './segment-text';

/**
 * Renders a text node's string, applying the text highlighter when one is configured.
 *
 * When `fastPath` is enabled and there is no highlighter (or no text), the input string is
 * returned directly. This is output-identical to the segmented path, which for a single plain
 * segment also returns the bare string, but skips the per-text-node segment array/object and
 * marks Set allocations.
 */
export function renderText(
	text: string | undefined,
	textHighlighter: TextHighlighter | undefined,
	marks: readonly Mark[],
	startPos: number,
	fastPath: boolean,
): string | React.JSX.Element {
	if (fastPath && (!textHighlighter || !text)) {
		return text ?? '';
	}

	const segments = segmentText(text, textHighlighter);
	return renderTextSegments(segments, textHighlighter, marks, startPos, fastPath);
}
