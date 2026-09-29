import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VrMockedViewerExample from '../5-vr-mocked-viewer';

export const VrMockedViewer: WorkbenchExample<typeof VrMockedViewerExample> =
	wb(VrMockedViewerExample);
