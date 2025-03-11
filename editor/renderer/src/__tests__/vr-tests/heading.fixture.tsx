import React from 'react';

import { headingNodeAdf } from '../__fixtures__/full-width-adf';
import adfHeadingsMultilined from '../__fixtures__/headings-multilined.adf.json';
import headingsLeftAligned from '../__fixtures__/headings-aligned-left.adf.json';
import headingsCenterAligned from '../__fixtures__/headings-aligned-center.adf.json';
import headingsRightAligned from '../__fixtures__/headings-aligned-right.adf.json';
import adfHeadingsRTLSymbols from '../__fixtures__/headings-right-aligned-symbols.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const HeadingRenderer = generateRendererComponent({
	document: headingNodeAdf,
	appearance: 'full-width',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingCommentRenderer = generateRendererComponent({
	document: headingNodeAdf,
	appearance: 'comment',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingMultilineRenderer = generateRendererComponent({
	document: adfHeadingsMultilined,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingsLeftRenderer = generateRendererComponent({
	document: headingsLeftAligned,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingsCenterRenderer = generateRendererComponent({
	document: headingsCenterAligned,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingsRightRenderer = generateRendererComponent({
	document: headingsRightAligned,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

function TextHighlighterComponent({ match }: { match: string }) {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<span style={{ color: 'red', textDecoration: 'underline' }}>{match}</span>
	);
}

export const HeadingsRTLSymbolsWithHighlighterRenderer = generateRendererComponent({
	document: adfHeadingsRTLSymbols,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
	textHighlighter: {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		pattern: /(?<acronym>\b[A-Z][A-Z0-9&]{2,}\b)/g,
		component: TextHighlighterComponent,
	},
	allowAnnotations: true,
	annotationProvider: {
		inlineComment: {
			allowDraftMode: true,
			allowCommentsOnMedia: true,
			getState: () => Promise.resolve([]),
		},
	},
});
