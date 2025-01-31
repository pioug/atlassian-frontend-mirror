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
} from './ssr.fixture';
import { snapshot, type ErrorFilterOption } from '@af/visual-regression';

const ignoredErrors: ErrorFilterOption[] = [
	{
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		pattern: /useLayoutEffect does nothing on the server/,
		ignoredBecause: 'This is an existing issue in the Renderer.',
		jiraIssueId: 'TODO-1',
	},
];

// Rendering via `renderToString` is not currently supported in our
// Gemini setup.
// It fails with a message: TextEncoder is not a constructor
// This needs to be fixed when we move to React 18, but for now
// This test only works on React 16.
if (process.env.IS_REACT_18 === 'false') {
	snapshot(RendererSSRTable, {
		description: 'SSR renderering of table nodes',
		ignoredErrors,
	});

	snapshot(RendererSSRLayout, {
		description: 'SSR renderering of layout nodes',
		ignoredErrors,
	});

	snapshot(RendererSSRCodeblock, {
		description: 'SSR renderering of code block nodes',
		ignoredErrors,
	});

	snapshot(RendererSSRCodeblockInBlockquote, {
		description: 'SSR renderering of code block node in blockquote node',
		ignoredErrors,
	});

	snapshot(RendererSSRMediaInBlockquote, {
		description: 'SSR renderering of media single and media group in blockquote node',
		ignoredErrors,
	});

	snapshot(RendererSSRExpand, {
		description: 'SSR renderering of expand nodes',
		ignoredErrors,
	});

	snapshot(RendererSSRNestedExpandInExpand, {
		description: 'SRR rendering of a nested expand in an expand',
		ignoredErrors,
	});

	snapshot(RendererSSRResizedImage, {
		description: 'SSR renderering of images',
		ignoredErrors,
	});

	snapshot(RendererSSRResizedMedia, {
		description: 'SSR renderering of various media',
		ignoredErrors,
	});

	snapshot(RendererSSRResizedMediaInTable, {
		description: 'SSR renderering of media in table',
		ignoredErrors,
	});

	snapshot(RendererSSRSmartCard, {
		description: 'SSR renderering of smart card',
		ignoredErrors,
	});

	snapshot(RendererSSRSmartCardUrlIcon, {
		description: 'SSR renderering of smart card using URL icon',
		ignoredErrors,
	});
}
