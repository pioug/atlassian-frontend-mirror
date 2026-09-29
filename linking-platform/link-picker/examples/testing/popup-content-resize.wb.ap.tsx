import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupContentResizeExample from '../40-popup-content-resize';

export const PopupContentResize: WorkbenchExample<typeof PopupContentResizeExample> =
	wb(PopupContentResizeExample);
