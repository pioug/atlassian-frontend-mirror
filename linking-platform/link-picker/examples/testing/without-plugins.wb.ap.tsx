import { wb, type WorkbenchExample } from '@atlassian/workbench';

import WithoutPluginsExample from '../20-without-plugins';

export const WithoutPlugins: WorkbenchExample<typeof WithoutPluginsExample> =
	wb(WithoutPluginsExample);
