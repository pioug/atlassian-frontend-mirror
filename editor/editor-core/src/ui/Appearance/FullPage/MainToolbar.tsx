import type React from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	CustomToolbarWrapperCompiled,
	MainToolbarIconBeforeCompiled,
	NonCustomToolbarWrapperCompiled,
} from './MainToolbar-compiled';
import {
	CustomToolbarWrapperEmotion,
	MainToolbarIconBeforeEmotion,
	NonCustomToolbarWrapperEmotion,
} from './MainToolbar-emotion';

export const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;

export const NonCustomToolbarWrapperMigration: React.ComponentType<{ children: React.ReactNode }> =
	componentWithCondition(
		() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
		NonCustomToolbarWrapperCompiled,
		NonCustomToolbarWrapperEmotion,
	);

export const CustomToolbarWrapperMigration: React.ComponentType<{ children: React.ReactNode }> =
	componentWithCondition(
		() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
		CustomToolbarWrapperCompiled,
		CustomToolbarWrapperEmotion,
	);

export const MainToolbarIconBeforeMigration: React.ComponentType<{ children: React.ReactNode }> =
	componentWithCondition(
		() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
		MainToolbarIconBeforeCompiled,
		MainToolbarIconBeforeEmotion,
	);
