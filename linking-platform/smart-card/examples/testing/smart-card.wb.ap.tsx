import { wb, type WorkbenchExample } from '@atlassian/workbench';

import EmbedFrameNavigationExample from '../embed-frame-navigation';
import VrEdgeCaseReduxStoreResetExample from '../vr-edge-case-redux-store-reset';

export const VrEdgeCaseReduxStoreReset: WorkbenchExample<typeof VrEdgeCaseReduxStoreResetExample> =
	wb(VrEdgeCaseReduxStoreResetExample);

export const EmbedFrameNavigation: WorkbenchExample<typeof EmbedFrameNavigationExample> = wb(
	EmbedFrameNavigationExample,
);
