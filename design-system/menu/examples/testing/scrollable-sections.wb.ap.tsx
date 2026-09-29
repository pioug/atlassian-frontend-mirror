import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ScrollableSectionsExample from '../scrollable-sections';

export const ScrollableSections: WorkbenchExample<typeof ScrollableSectionsExample> =
	wb(ScrollableSectionsExample);
