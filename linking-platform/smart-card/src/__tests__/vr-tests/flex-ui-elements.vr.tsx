import { snapshot } from '@af/visual-regression';

import FlexUiCustomElementsView from '../../../examples/vr-flexible-card/vr-flexible-ui-custom-elements';
import FlexUiAtlaskitBadgeView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-atlaskit-badge';
import FlexUiBaseTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-base-text';
import FlexUiModifiedOnView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-modified-on';
import FlexUiDateTimeTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-text-and-date';
import FlexUiOwnedByElementView from '../../../examples/vr-flexible-card/vr-flexible-ui-owned-by';
import FlexUiTitleElementView from '../../../examples/vr-flexible-card/vr-flexible-ui-title-element';

snapshot(FlexUiDateTimeTextView, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(FlexUiAtlaskitBadgeView, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(FlexUiBaseTextView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': [true, false],
	},
});

snapshot(FlexUiTitleElementView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': [true, false],
	},
});

snapshot(FlexUiOwnedByElementView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': [true, false],
	},
});

snapshot(FlexUiCustomElementsView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': true,
	},
});

snapshot(FlexUiModifiedOnView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': [true, false],
	},
});
