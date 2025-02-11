import { snapshot } from '@af/visual-regression';

import {
	DateWithBlueColor,
	DateWithDefaultColor,
	DateWithFormat,
	DateWithGreenColor,
	DateWithGreyColor,
	DateWithOnClick,
	DateWithPurpleColor,
} from './date.fixture';

snapshot(DateWithDefaultColor, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithDefaultColor, {
	description: 'Date with default color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithOnClick, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithFormat, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithBlueColor, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithBlueColor, {
	description: 'Date with blue color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithGreenColor, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithGreenColor, {
	description: 'Date with green color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithPurpleColor, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithPurpleColor, {
	description: 'Date with purple color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithGreyColor, {
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});

snapshot(DateWithGreyColor, {
	description: 'Date with grey color hovered',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	featureFlags: {
		platform_editor_css_migrate_stage_1: [true, false],
	},
});
