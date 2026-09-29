import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SkeletonItemsExample from '../06-skeleton-items.vr.ap';

export const SkeletonItems: WorkbenchExample<typeof SkeletonItemsExample> =
	wb(SkeletonItemsExample);
