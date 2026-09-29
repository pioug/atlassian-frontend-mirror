import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagImperativeCreatePopperExample from '../12-flag-imperative-create-popper.vr.ap';

export const FlagImperativeCreatePopper: WorkbenchExample<
	typeof FlagImperativeCreatePopperExample
> = wb(FlagImperativeCreatePopperExample);
