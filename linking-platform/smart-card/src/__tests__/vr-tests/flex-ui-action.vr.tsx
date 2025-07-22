import { snapshot } from '@af/visual-regression';

import {
	FlexibleUiBlockActionDanger,
	FlexibleUiBlockActionDefault,
	FlexibleUiBlockActionOverrideCSS,
	FlexibleUiBlockActionPrimary,
	FlexibleUiBlockActionSubtle,
	FlexibleUiBlockActionWarning,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-action';
import FlexibleUiBlockActionList from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action';
import FlexibleUiBlockActionGroup from '../../../examples/vr-flexible-card/vr-flexible-ui-block-action-group';
import {
	FlexibleUiCustomUnresolvedAction,
	FlexibleUiCustomUnresolvedActionOnlyShowIfAction,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-custom-unresolved-action';

snapshot(FlexibleUiBlockActionDanger, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionDefault, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockActionPrimary, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionSubtle, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionWarning, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionOverrideCSS, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
	waitForReactLazy: true,
});
snapshot(FlexibleUiBlockActionList, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockActionGroup, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockActionGroup, {
	description: 'flexible-ui-block-action-group--item hovered',
	drawsOutsideBounds: true,
	states: [{ selector: { byTestId: 'smart-action-delete-action' }, state: 'hovered' }],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(FlexibleUiBlockActionGroup, {
	description: 'flexible-ui-block-action-group--item focused',
	drawsOutsideBounds: true,
	states: [{ selector: { byTestId: 'smart-action-delete-action' }, state: 'focused' }],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

snapshot(FlexibleUiCustomUnresolvedActionOnlyShowIfAction, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': true,
	},
});
snapshot(FlexibleUiCustomUnresolvedAction, {
	featureFlags: {
		'platform-component-visual-refresh': true,
		'bandicoots-smart-card-teamwork-context': true,
	},
});
