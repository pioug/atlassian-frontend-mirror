import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultExample from '../01-default.vr.ap';

export const Default: WorkbenchExample<typeof DefaultExample> = wb(DefaultExample);

export default Default;
