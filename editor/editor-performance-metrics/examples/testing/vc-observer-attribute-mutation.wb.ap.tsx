import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VcObserverAttributeMutationExample from '../02-vc-observer-attribute-mutation';

export const VcObserverAttributeMutation: WorkbenchExample<
	typeof VcObserverAttributeMutationExample
> = wb(VcObserverAttributeMutationExample);
