import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DefaultModalExample from '../00-default-modal.vr.ap';

export const DefaultModal: WorkbenchExample<typeof DefaultModalExample> = wb(DefaultModalExample);
