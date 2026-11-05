import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../responsive-button-popup';

export const ResponsiveButtonPopup: WorkbenchExample<typeof Example> = wb(Example);
