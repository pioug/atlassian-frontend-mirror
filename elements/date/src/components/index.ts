import { DateLozenge as CompiledDateLozenge } from './compiled/DateLozenge';
import { DateLozenge as EmotionDateLozenge } from './DateLozenge';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

export const DateLozenge = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledDateLozenge,
	EmotionDateLozenge,
);

export { Date } from './Date';
