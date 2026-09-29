import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../Test-Integration-card-loading-motion.tsx';

export const TestIntegrationCardLoadingMotion: WorkbenchExample<typeof Example> = wb(Example);
