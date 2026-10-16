import { snapshot } from '@af/visual-regression';

import {
	NumberedHeadingsRenderer,
	RightAlignedNumberedHeadingsRenderer,
} from './numbered-headings.fixture.vr.ap';

snapshot(NumberedHeadingsRenderer, {
	description: 'numbers headings across tables, layouts and panels',
	featureFlags: { platform_editor_numbered_headings: true },
});

snapshot(RightAlignedNumberedHeadingsRenderer, {
	description: 'numbers right aligned headings',
	featureFlags: { platform_editor_numbered_headings: true },
});
