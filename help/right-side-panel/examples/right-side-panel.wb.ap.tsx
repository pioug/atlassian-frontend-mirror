import { wb, type WorkbenchExample } from '@atlassian/workbench';

import RightSidePanelExample from './0-Right-Side-Panel';
import RightSidePanelCustomWidthExample from './1-Right-Side-Panel-Custom-Width';

export const RightSidePanel: WorkbenchExample = wb(RightSidePanelExample);
export const RightSidePanelCustomWidth: WorkbenchExample = wb(RightSidePanelCustomWidthExample);
