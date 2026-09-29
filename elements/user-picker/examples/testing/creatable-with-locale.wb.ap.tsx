import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CreatableWithLocaleExample from '../12-creatable-with-locale';

export const CreatableWithLocale: WorkbenchExample<typeof CreatableWithLocaleExample> = wb(
	CreatableWithLocaleExample,
);
