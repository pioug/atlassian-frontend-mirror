import { wb, type WorkbenchExample } from '@atlassian/workbench';

import StackBasicCompiledExample from '../20-stack-basic-compiled.vr.ap';

export const StackBasicCompiled: WorkbenchExample<typeof StackBasicCompiledExample> =
	wb(StackBasicCompiledExample);
