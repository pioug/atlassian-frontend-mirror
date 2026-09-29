import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as ResizableSlotsExample } from '../resizable-slots';

export const ResizableSlots: WorkbenchExample<typeof ResizableSlotsExample> =
	wb(ResizableSlotsExample);
