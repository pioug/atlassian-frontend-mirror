import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlyoutMenuItemLazyLoadedContentFocusExample from '../flyout-menu-item-lazy-loaded-content-focus';

export const FlyoutMenuItemLazyLoadedContentFocus: WorkbenchExample<
	typeof FlyoutMenuItemLazyLoadedContentFocusExample
> = wb(FlyoutMenuItemLazyLoadedContentFocusExample);
