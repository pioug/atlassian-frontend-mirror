import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupExample from '../09-popup';

export const Popup: WorkbenchExample<typeof PopupExample> = wb(PopupExample);
