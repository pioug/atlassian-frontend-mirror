import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { Status as EmotionStatus } from './components/Status';
import { Status as CompiledStatus } from './components/compiled/Status';

const Status = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledStatus,
	EmotionStatus,
);

export { Status };
export type { StatusStyle, Props, Color } from './components/Status';
