import { wb, type WorkbenchExample } from '@atlassian/workbench';

import UncontrolledPanelExample from '../page-layout-uncontrolled-panel';

export const PageLayoutUncontrolledPanel: WorkbenchExample<typeof UncontrolledPanelExample> =
	wb(UncontrolledPanelExample);
