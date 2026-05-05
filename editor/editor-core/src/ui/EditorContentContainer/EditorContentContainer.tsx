import React, { type FC } from 'react';

import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	EditorContentContainerCompiled,
	type EditorContentContainerProps,
} from './EditorContentContainer-compiled';
import { EditorContentContainerEmotion } from './EditorContentContainer-emotion';

/**
 * Compiled Migration is WIP
 * If you are touching EditorContentContainerEmotion, please contact with #proj-cc-editor-full-compiled-css-migration
 * https://home.atlassian.com/o/2346a038-3c8c-498b-a79b-e7847859868d/s/a436116f-02ce-4520-8fbb-7301462a1674/project/ATLAS-120555
 */
const EditorContentContainer: FC<
	Omit<EditorContentContainerProps & React.RefAttributes<HTMLDivElement>, 'ref'> &
		Omit<EditorContentContainerProps & React.RefAttributes<HTMLDivElement>, 'ref'> &
		React.RefAttributes<HTMLDivElement>
> = componentWithCondition(
	() => expValEquals('platform_editor_core_static_css', 'isEnabled', true),
	EditorContentContainerCompiled,
	EditorContentContainerEmotion,
);

export default EditorContentContainer;
