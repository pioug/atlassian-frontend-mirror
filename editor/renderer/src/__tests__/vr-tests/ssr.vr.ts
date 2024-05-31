import {
	RendererSSRTable,
	RendererSSRLayout,
	RendererSSRCodeblock,
	RendererSSRExpand,
	RendererSSRResizedImage,
	RendererSSRResizedMedia,
	RendererSSRSmartCard,
	RendererSSRResizedMediaInTable,
} from './ssr.fixture';
import { snapshot, type ErrorFilterOption } from '@af/visual-regression';

const ignoredErrors: ErrorFilterOption[] = [
	{
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
if (process.env.IS_REACT_18 !== 'true') {
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

	snapshot(RendererSSRExpand, {
		description: 'SSR renderering of expand nodes',
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
}
