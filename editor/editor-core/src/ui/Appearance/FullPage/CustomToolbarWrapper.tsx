import type { FC } from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	MainToolbarForFirstChildWrapperCompiled,
	MainToolbarForSecondChildWrapperCompiled,
} from './CustomToolbarWrapper-compiled';
import {
	MainToolbarForFirstChildWrapperEmotion,
	MainToolbarForSecondChildWrapperEmotion,
} from './CustomToolbarWrapper-emotion';

export interface ChildWrapperProps {
	'aria-label'?: string;
	children: React.ReactNode;
	'data-testid'?: string;
	role?: string;
	twoLineEditorToolbar: boolean;
}

// ---------------- First child wrapper ----------------
export const MainToolbarForFirstChildWrapper: FC<ChildWrapperProps> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	MainToolbarForFirstChildWrapperCompiled,
	MainToolbarForFirstChildWrapperEmotion,
);

// ---------------- Second child wrapper ----------------
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const MainToolbarForSecondChildWrapper: FC<ChildWrapperProps> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	MainToolbarForSecondChildWrapperCompiled,
	MainToolbarForSecondChildWrapperEmotion,
);
