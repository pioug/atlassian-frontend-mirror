import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VrEdgeCaseReduxStoreResetExample from '../vr-edge-case-redux-store-reset';

export const VrEdgeCaseReduxStoreReset: WorkbenchExample<typeof VrEdgeCaseReduxStoreResetExample> =
	wb(VrEdgeCaseReduxStoreResetExample);
