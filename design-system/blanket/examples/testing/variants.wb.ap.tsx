import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VariantsExample from '../04-variants';

export const Variants: WorkbenchExample<typeof VariantsExample> = wb(VariantsExample);
