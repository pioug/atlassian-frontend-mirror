import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

export const CommentEditorTwoLineToolbar = () => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return (
		<ComposableEditor
			preset={preset}
			appearance="comment"
			primaryToolbarComponents={<div>custom primary toolbar</div>}
		/>
	);
};
