import type { FC } from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ChromelessEditorContainerCompiled } from './Chromeless-compiled';
import { ChromelessEditorContainerEmotion, type ChromelessEditorContainerProps } from './Chromeless-emotion';

/**
 * Container for the chromeless editor appearance. This is used to set the max and min height
 * of the editor content area, and to provide a ref to the container element for the popups.
 * @param param0 props for the chromeless editor container
 * @returns JSX element representing the chromeless editor container
 */
export const ChromelessEditorContainer: FC<
	ChromelessEditorContainerProps & ChromelessEditorContainerProps
> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	ChromelessEditorContainerCompiled,
	ChromelessEditorContainerEmotion,
);
