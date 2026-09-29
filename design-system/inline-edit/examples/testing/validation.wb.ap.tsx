import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ValidationExample from '../03-validation';

export const Validation: WorkbenchExample<typeof ValidationExample> = wb(ValidationExample);
