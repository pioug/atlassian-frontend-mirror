import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ThemedExample from '../themed.vr.ap';

export const Themed: WorkbenchExample<typeof ThemedExample> = wb(ThemedExample);
