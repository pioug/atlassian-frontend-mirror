import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../5-full-page-with-invite-from-mention';

export const FullPageWithInviteFromMention: WorkbenchExample<typeof Example> = wb(Example);
