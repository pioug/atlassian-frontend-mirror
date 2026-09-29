import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomItemExample from '../custom-item.vr.ap';

export const CustomItem: WorkbenchExample<typeof CustomItemExample> = wb(CustomItemExample);
