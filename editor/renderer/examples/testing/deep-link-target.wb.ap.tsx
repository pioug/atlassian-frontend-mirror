import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../105-deep-link-target';

export const DeepLinkTarget: WorkbenchExample<typeof Example> = wb(Example);
