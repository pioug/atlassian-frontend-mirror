import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './basic.vr.ap';
import LocalConnectExample from './local-connect';

export const Basic: WorkbenchExample = wb(BasicExample);
export const LocalConnect: WorkbenchExample = wb(LocalConnectExample);
