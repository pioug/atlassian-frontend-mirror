import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ProgressIndicatorAppearancesVrExample from './progress-indicator-appearances.vr.ap';
import ProgressIndicatorInteractionExample from './progress-indicator-interaction';
import WithConfigurationsExample from './with-configurations';

const ProgressIndicatorAppearancesVr: WorkbenchExample = wb(ProgressIndicatorAppearancesVrExample);

export default ProgressIndicatorAppearancesVr;
export const ProgressIndicatorInteraction: WorkbenchExample = wb(
	ProgressIndicatorInteractionExample,
);
export const WithConfigurations: WorkbenchExample = wb(WithConfigurationsExample);
