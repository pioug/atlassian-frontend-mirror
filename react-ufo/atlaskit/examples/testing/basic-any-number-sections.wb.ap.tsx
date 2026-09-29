import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicAnyNumberSectionsExample from '../03-basic-any-number-sections';

export const BasicAnyNumberSections: WorkbenchExample<typeof BasicAnyNumberSectionsExample> = wb(
	BasicAnyNumberSectionsExample,
);
