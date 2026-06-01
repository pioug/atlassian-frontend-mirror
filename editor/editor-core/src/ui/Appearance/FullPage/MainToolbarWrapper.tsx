import type React from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	MainToolbarWrapperCompiled,
	type MainToolbarWrapperCompiledProps,
} from './MainToolbarWrapper-compiled';
import { MainToolbarWrapperEmotion } from './MainToolbarWrapper-emotion';

export const MainToolbarWrapper: React.ComponentType<MainToolbarWrapperCompiledProps> =
	componentWithCondition(
		() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
		MainToolbarWrapperCompiled,
		MainToolbarWrapperEmotion,
	);
