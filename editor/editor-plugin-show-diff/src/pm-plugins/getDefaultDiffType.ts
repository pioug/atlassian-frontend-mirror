import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { DiffType } from '../showDiffPluginType';

export const getDefaultDiffType = (): DiffType =>
	fg('platform_editor_ai_smart_diff') ? 'smart' : 'inline';
