import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PopupExample from '../10-popup.vr.ap';

export const Popup: WorkbenchExample<typeof PopupExample> = wb(PopupExample);
