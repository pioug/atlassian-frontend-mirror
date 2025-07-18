import { snapshot } from '@af/visual-regression';
import { ParagraphRenderer } from './paragraph.fixture';

snapshot(ParagraphRenderer, {
	featureFlags: {
		platform_editor_hyperlink_underline: true,
	},
});
