import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomChildExample from '../95-custom-child.vr.ap';

export const CustomChild: WorkbenchExample<typeof CustomChildExample> = wb(CustomChildExample);
