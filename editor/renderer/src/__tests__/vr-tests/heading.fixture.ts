import { headingNodeAdf } from '../__fixtures__/full-width-adf';
import adfHeadingsMultilined from '../__fixtures__/headings-multilined.adf.json';
import headingsLeftAligned from '../__fixtures__/headings-aligned-left.adf.json';
import headingsCenterAligned from '../__fixtures__/headings-aligned-center.adf.json';
import headingsRightAligned from '../__fixtures__/headings-aligned-right.adf.json';
import adfHeadingsRTLEmoji from '../__fixtures__/headings-right-aligned-emoji.adf.json';
import adfHeadingsRTLStatus from '../__fixtures__/headings-right-aligned-status.adf.json';
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

export const HeadingsLeftMobileRenderer = generateRendererComponent(
	{
		document: headingsLeftAligned,
		appearance: 'mobile',
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	},
	{ viewport: { width: 320 } },
);

export const HeadingsCenterRenderer = generateRendererComponent({
	document: headingsCenterAligned,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingsCenterMobileRenderer = generateRendererComponent(
	{
		document: headingsCenterAligned,
		appearance: 'mobile',
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	},
	{ viewport: { width: 320 } },
);

export const HeadingsRightRenderer = generateRendererComponent({
	document: headingsRightAligned,
	appearance: 'full-page',
	allowHeadingAnchorLinks: {
		allowNestedHeaderLinks: true,
	},
});

export const HeadingsRightMobileRenderer = generateRendererComponent(
	{
		document: headingsRightAligned,
		appearance: 'mobile',
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	},
	{ viewport: { width: 320 } },
);

export const HeadingRightStatusRenderer = generateRendererComponent(
	{
		document: adfHeadingsRTLStatus,
		appearance: 'full-page',
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	},
	{ viewport: { width: 350 } },
);

export const HeadingRightSymbolsRenderer = generateRendererComponent(
	{
		document: adfHeadingsRTLSymbols,
		appearance: 'full-page',
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	},
	{ viewport: { width: 350 } },
);

export const HeadingRightEmojiRenderer = generateRendererComponent(
	{
		document: adfHeadingsRTLEmoji,
		appearance: 'full-page',
		allowHeadingAnchorLinks: {
			allowNestedHeaderLinks: true,
		},
	},
	{ viewport: { width: 350 } },
);
