import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicThreeSectionsExample } from '../02-basic-three-sections';

export const BasicThreeSections: WorkbenchExample<typeof BasicThreeSectionsExample> =
	wb(BasicThreeSectionsExample);
