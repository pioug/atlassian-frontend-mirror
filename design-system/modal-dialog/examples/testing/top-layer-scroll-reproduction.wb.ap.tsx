import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TopLayerScrollReproductionExample from '../95-top-layer-scroll-reproduction';

export const TopLayerScrollReproduction: WorkbenchExample<
	typeof TopLayerScrollReproductionExample
> = wb(TopLayerScrollReproductionExample);
