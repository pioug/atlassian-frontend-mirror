import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../Test-Integration-card-files-mocked.tsx';

export const TestIntegrationCardFilesMocked: WorkbenchExample<typeof Example> = wb(Example);
