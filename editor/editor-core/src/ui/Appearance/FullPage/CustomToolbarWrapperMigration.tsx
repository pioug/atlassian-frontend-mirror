import type React from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { CustomToolbarWrapperCompiled } from './MainToolbar-compiled';
import { CustomToolbarWrapperEmotion } from './MainToolbar-emotion';

export const CustomToolbarWrapperMigration: React.ComponentType<{ children: React.ReactNode }> =
	componentWithCondition(
		() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
		CustomToolbarWrapperCompiled,
		CustomToolbarWrapperEmotion,
	);
