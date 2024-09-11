import { snapshot } from '@af/visual-regression';
import {
	HeadingRenderer,
	HeadingsCenterRenderer,
	HeadingsLeftRenderer,
	HeadingsRightRenderer,
	HeadingsRTLSymbolsWithHighlighterRenderer,
	HeadingCommentRenderer,
	HeadingMultilineRenderer,
} from './heading.fixture';

snapshot(HeadingRenderer);
snapshot(HeadingsCenterRenderer);
snapshot(HeadingsLeftRenderer);
snapshot(HeadingsRightRenderer);
// With the highlight renderer enabled it should not show symbols incorrectly
snapshot(HeadingsRTLSymbolsWithHighlighterRenderer);

/**
 * Other cases
 */
snapshot(HeadingRenderer, {
	description: 'heading should show anchor on link',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'link' },
		},
	],
});

snapshot(HeadingCommentRenderer, {
	description: 'heading not show anchor on comment renderer',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 1 } },
		},
	],
});

/**
 * Multiline tests
 */
snapshot(HeadingMultilineRenderer, {
	description: 'heading link should render for multilined left',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'heading',
				options: { name: 'Multiline heading left' },
			},
		},
	],
});

snapshot(HeadingMultilineRenderer, {
	description: 'heading link should render for multilined center',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'heading',
				options: { name: 'Multiline heading center' },
			},
		},
	],
});

snapshot(HeadingMultilineRenderer, {
	description: 'heading link should render for multilined right',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'heading',
				options: { name: 'Multiline heading right' },
			},
		},
	],
});

/**
 * Headings with anchor link - snapshot every level for left (most common)
 * Then once for center and right aligned - this should be sufficient
 */
snapshot(HeadingsLeftRenderer, {
	description: 'heading left with links heading 1 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 1 } },
		},
	],
});

snapshot(HeadingsLeftRenderer, {
	description: 'heading left with links heading 2 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 2 } },
		},
	],
});
snapshot(HeadingsLeftRenderer, {
	description: 'heading left with links heading 3 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 3 } },
		},
	],
});
snapshot(HeadingsLeftRenderer, {
	description: 'heading left with links heading 4 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 4 } },
		},
	],
});
snapshot(HeadingsLeftRenderer, {
	description: 'heading left with links heading 5 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 5 } },
		},
	],
});
snapshot(HeadingsLeftRenderer, {
	description: 'heading left with links heading 6 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 6 } },
		},
	],
});

snapshot(HeadingsRightRenderer, {
	description: 'heading right with links heading 1 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 1 } },
		},
	],
});

snapshot(HeadingsCenterRenderer, {
	description: 'heading center with links heading 1 hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'heading', options: { level: 1 } },
		},
	],
});
