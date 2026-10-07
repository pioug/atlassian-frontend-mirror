import { snapshot } from '@af/visual-regression';

import {
	BackgroundColorDefinedColors,
	BackgroundColorOverlapped,
	BackgroundColorCustomColors,
	BackgroundColorOverlappedReactRenderer,
	BackgroundColorOverlappedRootRendererWithAnalytics,
	BackgroundColorOverlappedRendererWithAnnotationSelection,
	BackgroundColorOverlappedRenderer,
	BackgroundColorOverlappedRendererFunctionalComponent,
	BackgroundColorOverlappedRendererWithAnalytics,
} from './highlight.fixture.vr.ap';

const featureFlags = {
	editor_inline_comments_on_inline_nodes: [true, false],
};

snapshot(BackgroundColorDefinedColors, {
	description: 'should render six defined highlight text colors',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags,
});

snapshot(BackgroundColorOverlapped, {
	description: 'should render overlapped highlight with inline comments',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags,
});

snapshot(BackgroundColorCustomColors, {
	description: 'should render custom highlight colors',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags,
});

// Legacy endpoint migration tests; remove after migration (projected end Dec 2026).
snapshot(BackgroundColorOverlappedReactRenderer, {
	description: 'legacy ReactRenderer should render overlapped highlight with inline comments',
});

snapshot(BackgroundColorOverlappedRenderer, {
	description: 'legacy Renderer should NOT render overlapped highlight with inline comments',
});

snapshot(BackgroundColorOverlappedRendererFunctionalComponent, {
	description:
		'legacy RendererFunctionalComponent should NOT render overlapped highlight with inline comments',
});

snapshot(BackgroundColorOverlappedRendererWithAnalytics, {
	description:
		'legacy RendererWithAnalytics should NOT render overlapped highlight with inline comments',
});

snapshot(BackgroundColorOverlappedRendererWithAnnotationSelection, {
	description:
		'legacy RendererWithAnnotationSelection should render overlapped highlight with inline comments',
});

snapshot(BackgroundColorOverlappedRootRendererWithAnalytics, {
	description:
		'legacy root RendererWithAnalytics should NOT render overlapped highlight with inline comments',
});
