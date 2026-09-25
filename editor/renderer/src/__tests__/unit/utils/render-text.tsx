import React from 'react';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { render } from '@atlassian/testing-library/render';

import type { TextHighlighter } from '../../../react/types';
import { renderText } from '../../../react/utils/render-text';

const marks = [schema.marks.strong.create(), schema.marks.em.create()];

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const acronyms = /(\b[A-Z]{2,}\b)/g;

const makeHighlighter = (): { highlighter: TextHighlighter; seenMarks: Array<Set<string>> } => {
	const seenMarks: Array<Set<string>> = [];
	const highlighter: TextHighlighter = {
		pattern: acronyms,
		component: ({ children, marks }) => {
			seenMarks.push(marks);
			return <em data-testid="hl">{children}</em>;
		},
	};
	return { highlighter, seenMarks };
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('renderText', () => {
	describe.each([[true], [false]])('fastPath=%s', (fastPath) => {
		it('returns the bare string when there is no highlighter', () => {
			expect(renderText('hello world', undefined, marks, 5, fastPath)).toBe('hello world');
		});

		it('returns an empty string for undefined text', () => {
			expect(renderText(undefined, undefined, marks, 5, fastPath)).toBe('');
		});

		it('returns the bare string when the highlighter has no match', () => {
			const { highlighter } = makeHighlighter();
			expect(renderText('no acronyms here', highlighter, marks, 5, fastPath)).toBe(
				'no acronyms here',
			);
		});

		it('wraps matches and passes the mark names when the highlighter matches', () => {
			const { highlighter, seenMarks } = makeHighlighter();
			const out = renderText('Some ADF text', highlighter, marks, 5, fastPath);
			const { container } = render(<>{out}</>);

			expect(container.querySelectorAll('[data-highlighted]')).toHaveLength(1);
			expect(container.textContent).toBe('Some ADF text');
			expect(seenMarks).toHaveLength(1);
			expect(seenMarks[0]).toEqual(new Set(['strong', 'em']));
		});
	});

	it('produces identical output with and without the fast path', () => {
		const { highlighter } = makeHighlighter();
		const cases: Array<[string | undefined, TextHighlighter | undefined]> = [
			['plain', undefined],
			[undefined, undefined],
			['', highlighter],
			['no match', highlighter],
			['ADF and PDF', highlighter],
		];
		for (const [text, hl] of cases) {
			const fast = render(<>{renderText(text, hl, marks, 3, true)}</>);
			const slow = render(<>{renderText(text, hl, marks, 3, false)}</>);
			expect(fast.container.innerHTML).toBe(slow.container.innerHTML);
		}
	});
});
