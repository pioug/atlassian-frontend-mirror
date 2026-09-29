import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ResizeExample from '../2-resize.vr.ap';

export const Resize: WorkbenchExample<typeof ResizeExample> = wb(ResizeExample);
