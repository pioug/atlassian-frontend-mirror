import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TextFieldsExample from '../01-text-fields';

export const TextFields: WorkbenchExample<typeof TextFieldsExample> = wb(TextFieldsExample);
