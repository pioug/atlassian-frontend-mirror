import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VariationsExample from '../01-variations.vr.ap';

export const Variations: WorkbenchExample<typeof VariationsExample> = wb(VariationsExample);
