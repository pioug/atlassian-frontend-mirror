import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ComplexLayeringExample from '../1-complex-layering.vr.ap';

export const ComplexLayering: WorkbenchExample<typeof ComplexLayeringExample> =
	wb(ComplexLayeringExample);
