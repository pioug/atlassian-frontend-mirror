import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TextCompiledExample from '../70-text-compiled.vr.ap';

export const TextCompiled: WorkbenchExample<typeof TextCompiledExample> = wb(TextCompiledExample);
