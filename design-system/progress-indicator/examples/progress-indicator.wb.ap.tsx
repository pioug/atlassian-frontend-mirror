import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ProgressIndicatorAppearancesVrExample from './progress-indicator-appearances.vr.ap';
import ProgressIndicatorInteractionExample from './progress-indicator-interaction';
import WithConfigurationsExample from './with-configurations';

// Explicit named export Used to generate integration-test URLs.
export const ProgressIndicatorAppearances: WorkbenchExample = wb(
	ProgressIndicatorAppearancesVrExample,
);
// Default export required by accessibility tooling.
export default ProgressIndicatorAppearances;
export const ProgressIndicatorInteraction: WorkbenchExample = wb(
	ProgressIndicatorInteractionExample,
);
export const WithConfigurations: WorkbenchExample = wb(WithConfigurationsExample);
