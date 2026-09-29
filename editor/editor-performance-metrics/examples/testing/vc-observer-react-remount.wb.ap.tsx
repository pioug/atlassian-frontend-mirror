import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VcObserverReactRemountExample from '../03-vc-observer-react-remount';

export const VcObserverReactRemount: WorkbenchExample<typeof VcObserverReactRemountExample> = wb(
	VcObserverReactRemountExample,
);
