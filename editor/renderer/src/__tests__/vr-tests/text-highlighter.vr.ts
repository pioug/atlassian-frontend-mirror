import { snapshot } from '@af/visual-regression';
import {
	RendererWithTextHighlighter,
	RendererWithFilteredTextHighlighter,
} from '../__helpers/renderer-with-text-highlighter';

const featureFlags = {
	platform_editor_hyperlink_underline: true,
};

snapshot(RendererWithTextHighlighter, {
	featureFlags,
});

snapshot(RendererWithFilteredTextHighlighter, {
	featureFlags,
});
