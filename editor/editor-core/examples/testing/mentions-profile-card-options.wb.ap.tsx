import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../41-mentions-profile-card-options';

export const MentionsProfileCardOptions: WorkbenchExample<typeof Example> = wb(Example);
