import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CardExample from '../card.vr.ap';

export const Card: WorkbenchExample<typeof CardExample> = wb(CardExample);
