import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagPopperEscapedExample from '../08-flag-popper-escaped';

export const FlagPopperEscaped: WorkbenchExample<typeof FlagPopperEscapedExample> =
	wb(FlagPopperEscapedExample);
