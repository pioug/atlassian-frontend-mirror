import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CompositionExample from '../composition.vr.ap';

export const Composition: WorkbenchExample<typeof CompositionExample> = wb(CompositionExample);
