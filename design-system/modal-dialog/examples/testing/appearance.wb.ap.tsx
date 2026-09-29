import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AppearanceExample from '../10-appearance.vr.ap';

export const Appearance: WorkbenchExample<typeof AppearanceExample> = wb(AppearanceExample);
