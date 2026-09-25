import React from 'react';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { ReactSerializer } from '../../../index';
import type { TextHighlighter } from '../../types';

const doc = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Plain paragraph with an ADF acronym.' }],
		},
		{ type: 'paragraph' },
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'Bold ', marks: [{ type: 'strong' }] },
				{ type: 'text', text: 'and italic', marks: [{ type: 'em' }] },
				{ type: 'text', text: ' and a PDF file' },
			],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'item' }] }],
				},
				{ type: 'listItem', content: [{ type: 'paragraph' }] },
			],
		},
	],
};

const highlighter: TextHighlighter = {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	pattern: /(\b[A-Z]{2,}\b)/g,
	component: ({ children }) => <em data-testid="hl">{children}</em>,
};

const HL = (text: string) =>
	`<span data-highlighted="true" data-vc="highlighted-text"><em data-testid="hl">${text}</em></span>`;

// Expected DOM for the fixture. The text wrapper (annotation draft mode) and the fast path must
// never change it; only the highlighter does.
const expectedHtml = (hl: (text: string) => string) =>
	'<div class="ak-renderer-document">' +
	`<p data-renderer-start-pos="1">Plain paragraph with an ${hl('ADF')} acronym.</p>` +
	'<p data-renderer-start-pos="39">&nbsp;</p>' +
	'<p data-renderer-start-pos="41"><strong data-renderer-mark="true">Bold </strong>' +
	`<em data-renderer-mark="true">and italic</em> and a ${hl('PDF')} file</p>` +
	'<ul class="ak-ul" data-indent-level="1">' +
	'<li><p data-renderer-start-pos="75">item</p></li>' +
	'<li><p data-renderer-start-pos="83">&nbsp;</p></li>' +
	'</ul></div>';

const EXPECTED_PLAIN = expectedHtml((t) => t);
const EXPECTED_HIGHLIGHTED = expectedHtml(HL);

type Opts = { surroundTextNodesWithTextWrapper?: boolean; textHighlighter?: TextHighlighter };

const renderDoc = (opts: Opts) => {
	const serializer = new ReactSerializer({ disableHeadingIDs: true, ...opts });
	const node = schema.nodeFromJSON(doc);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return renderWithIntl(serializer.serializeFragment(node.content) as any).container.innerHTML;
};

const cases: Array<[string, Opts, string]> = [
	['no highlighter, no text wrapper', {}, EXPECTED_PLAIN],
	['highlighter, no text wrapper', { textHighlighter: highlighter }, EXPECTED_HIGHLIGHTED],
	['no highlighter, text wrapper', { surroundTextNodesWithTextWrapper: true }, EXPECTED_PLAIN],
	[
		'highlighter, text wrapper',
		{ surroundTextNodesWithTextWrapper: true, textHighlighter: highlighter },
		EXPECTED_HIGHLIGHTED,
	],
];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - ReactSerializer - text/paragraph fast path', () => {
	const assertAllCases = () => {
		it.each(cases)('renders the expected DOM for %s', (_case, opts, expected) => {
			expect(renderDoc(opts)).toBe(expected);
		});
	};

	describe('serializer output [true]', () => {
		beforeEach(() => {
			mockExpEnabled('platform_renderer_text_paragraph_fast_path');
		});
		assertAllCases();
	});

	describe('serializer output [false]', () => {
		beforeEach(() => {
			mockExpDisabled('platform_renderer_text_paragraph_fast_path');
		});
		assertAllCases();
	});
});
