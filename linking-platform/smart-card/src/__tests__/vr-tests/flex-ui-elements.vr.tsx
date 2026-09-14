import { snapshot } from '@af/visual-regression';

import FlexUiCustomElementsView from '../../../examples/vr-flexible-card/vr-flexible-ui-custom-elements.vr.ap';
import FlexUiAtlaskitBadgeView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-atlaskit-badge.vr.ap';
import FlexUiBaseTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-base-text.vr.ap';
import FlexUiModifiedOnView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-modified-on.vr.ap';
import FlexUiDateTimeTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-text-and-date.vr.ap';
import FlexUiOwnedByElementView from '../../../examples/vr-flexible-card/vr-flexible-ui-owned-by.vr.ap';
import FlexUiTitleElementView from '../../../examples/vr-flexible-card/vr-flexible-ui-title-element.vr.ap';

snapshot(FlexUiDateTimeTextView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexUiAtlaskitBadgeView, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexUiBaseTextView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexUiTitleElementView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexUiOwnedByElementView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexUiCustomElementsView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexUiModifiedOnView, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
