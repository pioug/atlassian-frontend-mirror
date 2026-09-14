import { snapshot } from '@af/visual-regression';

import ActionItem from '../../../examples/vr-flexible-card/vr-action-lozenge-action-item.vr.ap';
import ActionItemsGroup from '../../../examples/vr-flexible-card/vr-action-lozenge-action-items-group.vr.ap';
import ActionTrigger from '../../../examples/vr-flexible-card/vr-action-lozenge-action-trigger.vr.ap';
import ErrorActionWithUrl from '../../../examples/vr-flexible-card/vr-action-lozenge-error-action-with-url.vr.ap';
import ErrorAction from '../../../examples/vr-flexible-card/vr-action-lozenge-error-action.vr.ap';

snapshot(ActionItem, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
});

snapshot(ActionTrigger, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
});

snapshot(ActionItemsGroup, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
});

snapshot(ErrorAction);
snapshot(ErrorActionWithUrl);
