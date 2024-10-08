import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

import { textsWithFiftyLines } from './comment-editor-with-maxheight-set.adf';

export const CommentEditorWithMaxHeight = () => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return (
		<ComposableEditor
			defaultValue={textsWithFiftyLines}
			preset={preset}
			appearance="comment"
			maxHeight={500}
		/>
	);
};
