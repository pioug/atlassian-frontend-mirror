import { snapshot } from '@af/visual-regression';
import type { ErrorFilterOption } from '@af/visual-regression';

import {
	RendererSSRTable,
	RendererSSRLayout,
	RendererSSRCodeblock,
	RendererSSRCodeblockInBlockquote,
	RendererSSRMediaInBlockquote,
	RendererSSRExpand,
	RendererSSRNestedExpandInExpand,
	RendererSSRResizedImage,
	RendererSSRResizedMedia,
	RendererSSRSmartCard,
	RendererSSRResizedMediaInTable,
	RendererSSRSmartCardUrlIcon,
} from './ssr.fixture.vr.ap';

const ignoredErrors: ErrorFilterOption[] = [
	{
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		pattern: /useLayoutEffect does nothing on the server/,
		ignoredBecause: 'This is an existing issue in the Renderer.',
		jiraIssueId: 'TODO-1',
	},
];

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRTable, {
	description: 'SSR renderering of table nodes',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRLayout, {
	description: 'SSR renderering of layout nodes',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRCodeblock, {
	description: 'SSR renderering of code block nodes',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRCodeblockInBlockquote, {
	description: 'SSR renderering of code block node in blockquote node',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRMediaInBlockquote, {
	description: 'SSR renderering of media single and media group in blockquote node',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRExpand, {
	description: 'SSR renderering of expand nodes',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRNestedExpandInExpand, {
	description: 'SRR rendering of a nested expand in an expand',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRResizedImage, {
	description: 'SSR renderering of images',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRResizedMedia, {
	description: 'SSR renderering of various media',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRResizedMediaInTable, {
	description: 'SSR renderering of media in table',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRSmartCard, {
	description: 'SSR renderering of smart card',
	ignoredErrors,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(RendererSSRSmartCardUrlIcon, {
	description: 'SSR renderering of smart card using URL icon',
	ignoredErrors,
});
