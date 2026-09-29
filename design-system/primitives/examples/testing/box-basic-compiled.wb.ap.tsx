import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BoxBasicCompiledExample from '../01-box-basic-compiled';

export const BoxBasicCompiled: WorkbenchExample<typeof BoxBasicCompiledExample> =
	wb(BoxBasicCompiledExample);
