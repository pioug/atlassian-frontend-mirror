import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { StatusPicker as EmotionStatusPicker } from './components/StatusPicker';
import { StatusPicker as CompiledStatusPicker } from './components/compiled/StatusPicker';

const StatusPicker = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledStatusPicker,
	EmotionStatusPicker,
);

export { StatusPicker };
export type { Props, ColorType } from './components/StatusPicker';
