import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../13-smart-card-datasource';

export const SmartCardDatasource: WorkbenchExample<typeof Example> = wb(Example);
