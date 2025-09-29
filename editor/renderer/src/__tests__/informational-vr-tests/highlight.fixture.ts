import * as adfBackgroundColorYellow from '../__fixtures__/highlight-yellow.adf.json';
import * as adfHighlightPadding from '../__fixtures__/highlight-padding.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents';

export const BackgroundColorYellow = generateRendererComponent({
	document: adfBackgroundColorYellow,
	appearance: 'comment',
});

export const HighlightPadding = generateRendererComponent({
	document: adfHighlightPadding,
	appearance: 'comment',
	featureFlags: {
		platform_editor_text_highlight_padding: true,
	},
});
