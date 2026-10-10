import React from 'react';

import LinkIconButton from '@atlaskit/button/icon/link';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { alignmentPlugin } from '@atlaskit/editor-plugin-alignment/alignmentPlugin';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion/contentInsertionPlugin';
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight/highlightPlugin';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block/insert-block-plugin';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout/layout-plugin';
import { listPlugin } from '@atlaskit/editor-plugin-list/list-plugin';
import { tablePlugin } from '@atlaskit/editor-plugin-table/table-plugin';
import { textColorPlugin } from '@atlaskit/editor-plugin-text-color/text-color-plugin';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugin-toolbar-lists-indentation/toolbar-lists-indentation-plugin';
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
