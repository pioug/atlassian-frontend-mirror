import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../23-with-mock-template-variables';

export const WithMockTemplateVariables: WorkbenchExample<typeof Example> = wb(Example);
