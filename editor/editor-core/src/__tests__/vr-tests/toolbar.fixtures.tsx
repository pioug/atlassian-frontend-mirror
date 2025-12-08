import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { alignmentPlugin } from '@atlaskit/editor-plugin-alignment';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { tablePlugin } from '@atlaskit/editor-plugin-table';
import { textColorPlugin } from '@atlaskit/editor-plugin-text-color';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugin-toolbar-lists-indentation';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';

export const EditorToolbarWithIconBefore = (): React.JSX.Element => {
	const { preset } = usePreset(() =>
		createDefaultPreset({})
			.add(highlightPlugin)
			.add(contentInsertionPlugin)
			.add(tablePlugin)
			.add(layoutPlugin)
			.add(textColorPlugin)
			.add(listPlugin)
			.add([
				toolbarListsIndentationPlugin,
				{ showIndentationButtons: true, allowHeadingAndParagraphIndentation: true },
			])
			.add(alignmentPlugin)
			.add(insertBlockPlugin),
	);

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
