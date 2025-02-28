import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

import { Status as EmotionStatus } from './components/Status';
import { Status as CompiledStatus } from './components/compiled/Status';
import { StatusPicker as EmotionStatusPicker } from './components/StatusPicker';
import { StatusPicker as CompiledStatusPicker } from './components/compiled/StatusPicker';

const Status = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledStatus,
	EmotionStatus,
);

const StatusPicker = componentWithFG(
	'platform_editor_css_migrate_stage_1',
	CompiledStatusPicker,
	EmotionStatusPicker,
);

export { Status, StatusPicker };
export type { StatusStyle, Props, Color } from './components/Status';
export type { Props as StatusPickerProps } from './components/StatusPicker';
