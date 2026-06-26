import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { FullPageContentAreaCompiled } from './FullPageContentArea-compiled';
import { FullPageContentAreaEmotion } from './FullPageContentArea-emotion';

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const EDITOR_CONTAINER = 'ak-editor-container';

/**
 * Compiled migration WIP under platform_editor_core_non_ecc_static_css
 * Please ensure both styles are updated
 */
export const FullPageContentArea: typeof FullPageContentAreaCompiled = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	FullPageContentAreaCompiled,
	FullPageContentAreaEmotion,
) as typeof FullPageContentAreaCompiled;
