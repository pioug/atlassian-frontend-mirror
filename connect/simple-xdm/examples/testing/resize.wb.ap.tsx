import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ResizeExample from '../resize';

export const Resize: WorkbenchExample<typeof ResizeExample> = wb(ResizeExample);
