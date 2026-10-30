import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';

export const EmptyCommentEditor = (): React.JSX.Element => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return <ComposableEditor preset={preset} appearance="comment" maxHeight={500} />;
};

export const CommentEditorTwoLineToolbar = (): React.JSX.Element => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return (
		<ComposableEditor
			preset={preset}
			appearance="comment"
			maxHeight={500}
			primaryToolbarComponents={<div>custom primary toolbar</div>}
		/>
	);
};
