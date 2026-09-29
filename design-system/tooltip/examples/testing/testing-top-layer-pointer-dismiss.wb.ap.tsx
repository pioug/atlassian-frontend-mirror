import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingTopLayerPointerDismissExample from '../testing-top-layer-pointer-dismiss';

export const TestingTopLayerPointerDismiss: WorkbenchExample<
	typeof TestingTopLayerPointerDismissExample
> = wb(TestingTopLayerPointerDismissExample);
