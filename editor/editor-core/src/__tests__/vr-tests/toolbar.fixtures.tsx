import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';

export const EditorToolbarWithIconBefore = () => {
	const { preset } = usePreset(() => createDefaultPreset({}));
	return (
		<ComposableEditor
			preset={preset}
			appearance="full-page"
			primaryToolbarIconBefore={
				<LinkIconButton
					icon={AtlassianIcon}
					label="Atlassian Home"
					appearance="subtle"
					href="https://atlaskit.atlassian.com/"
				/>
			}
		/>
	);
};
