import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../5-with-text-serializer';

export const WithTextSerializer: WorkbenchExample<typeof Example> = wb(Example);
