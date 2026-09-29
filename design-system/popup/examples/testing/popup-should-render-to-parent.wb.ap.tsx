import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupShouldRenderToParentExample from '../21-popup-should-render-to-parent';

export const PopupShouldRenderToParent: WorkbenchExample<typeof PopupShouldRenderToParentExample> =
	wb(PopupShouldRenderToParentExample);
