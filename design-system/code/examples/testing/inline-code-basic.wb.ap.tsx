import { wb, type WorkbenchExample } from '@atlassian/workbench';

import InlineCodeBasicExample from '../01-inline-code-basic.vr.ap';

export const InlineCodeBasic: WorkbenchExample<typeof InlineCodeBasicExample> =
	wb(InlineCodeBasicExample);
