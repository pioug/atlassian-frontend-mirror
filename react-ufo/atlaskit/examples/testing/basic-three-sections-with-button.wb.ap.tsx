import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicThreeSectionsWithButtonExample } from '../14-basic-three-sections-with-button';

export const BasicThreeSectionsWithButton: WorkbenchExample<
	typeof BasicThreeSectionsWithButtonExample
> = wb(BasicThreeSectionsWithButtonExample);
