import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as ClassAttributeMutationExample } from '../13-class-attribute-mutation';

export const ClassAttributeMutation: WorkbenchExample<typeof ClassAttributeMutationExample> = wb(
	ClassAttributeMutationExample,
);
