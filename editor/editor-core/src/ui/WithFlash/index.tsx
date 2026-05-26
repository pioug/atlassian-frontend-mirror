import React from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { WithFlashCompiled } from './withFlash-compiled';
import { WithFlashEmotion } from './withFlash-emotion';

export interface Props {
	animate: boolean;
	children?: React.ReactNode;
}

const WithFlash: React.ComponentType<Props> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	WithFlashCompiled,
	WithFlashEmotion,
);

export default WithFlash;
