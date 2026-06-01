import type { FC, ReactElement } from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { BeforePrimaryToolbarWrapperCompiled } from './BeforeWrapper-compiled';
import { BeforePrimaryToolbarWrapperEmotion } from './BeforeWrapper-emotion';

type ReactComponents = ReactElement | ReactElement[];

// Duplicate of the wrapper from `editor-plugins/before-primary-toolbar` used
// only in `FullPageToolbar` to decouple the plugin from the main toolbar
export const BeforePrimaryToolbarWrapper: FC<{
	beforePrimaryToolbarComponents: ReactComponents | undefined;
}> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	BeforePrimaryToolbarWrapperCompiled,
	BeforePrimaryToolbarWrapperEmotion,
);
