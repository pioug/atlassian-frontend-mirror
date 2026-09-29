import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagShouldRenderToParentTopLayerExample from '../flag-should-render-to-parent-top-layer';

export const FlagShouldRenderToParentTopLayer: WorkbenchExample<
	typeof FlagShouldRenderToParentTopLayerExample
> = wb(FlagShouldRenderToParentTopLayerExample);
