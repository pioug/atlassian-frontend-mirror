import { snapshot } from '@af/visual-regression';

import {
	FlexibleUiBlockActionDanger,
	FlexibleUiBlockActionDefault,
	FlexibleUiBlockActionOverrideCSS,
	FlexibleUiBlockActionPrimary,
	FlexibleUiBlockActionSubtle,
	FlexibleUiBlockActionWarning,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-action.vr.ap';
import FlexibleUiBlockActionGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action-group.vr.ap';
import FlexibleUiBlockActionList from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action.vr.ap';
import {
	FlexibleUiCustomUnresolvedAction,
	FlexibleUiCustomUnresolvedActionOnlyShowIfAction,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-custom-unresolved-action.vr.ap';

snapshot(FlexibleUiBlockActionDanger, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionDefault, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionPrimary, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionSubtle, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionWarning, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionOverrideCSS, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionList, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionGroup, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionGroup, {
	description: 'flexible-ui-block-action-group--item hovered',
	drawsOutsideBounds: true,
	states: [{ selector: { byTestId: 'smart-action-delete-action' }, state: 'hovered' }],
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionGroup, {
	description: 'flexible-ui-block-action-group--item focused',
	drawsOutsideBounds: true,
	states: [{ selector: { byTestId: 'smart-action-delete-action' }, state: 'focused' }],
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});

snapshot(FlexibleUiCustomUnresolvedActionOnlyShowIfAction, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiCustomUnresolvedAction, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
});
