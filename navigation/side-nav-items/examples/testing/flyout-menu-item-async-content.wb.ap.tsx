import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlyoutMenuItemAsyncContentExample from '../flyout-menu-item-async-content.vr.ap';

export const FlyoutMenuItemAsyncContent: WorkbenchExample<
	typeof FlyoutMenuItemAsyncContentExample
> = wb(FlyoutMenuItemAsyncContentExample);
