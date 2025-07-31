import React from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { datePlugin } from '@atlaskit/editor-plugin-date';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { expandPlugin } from '@atlaskit/editor-plugin-expand';
import { extensionPlugin } from '@atlaskit/editor-plugin-extension';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { imageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugin-rule';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { statusPlugin } from '@atlaskit/editor-plugin-status';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { trackChangesPlugin } from '../src/trackChangesPlugin';

const styles = cssMap({
	aboveEditor: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
	},
	everythingContainer: {
		paddingTop: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
	},
});

const createPreset = () =>
	new EditorPresetBuilder()
		.add(basePlugin)
		.add(typeAheadPlugin)
		.add(widthPlugin)
		.add(compositionPlugin)
		.add([analyticsPlugin, {}])
		.add(editorDisabledPlugin)
		.add(contentInsertionPlugin)
		.add(guidelinePlugin)
		.add(selectionPlugin)
		.add(decorationsPlugin)
		.add(tablesPlugin)
		.add(hyperlinkPlugin)
		.add(datePlugin)
		.add(listPlugin)
		.add(blockTypePlugin)
		.add(imageUploadPlugin)
		.add(emojiPlugin)
		.add(quickInsertPlugin)
		.add(rulePlugin)
		.add(codeBlockPlugin)
		.add(panelPlugin)
		.add(focusPlugin)
		.add(gridPlugin)
		.add(copyButtonPlugin)
		.add(floatingToolbarPlugin)
		.add(mediaPlugin)
		.add(statusPlugin)
		.add(mentionsPlugin)
		.add(layoutPlugin)
		.add(expandPlugin)
		.add([placeholderTextPlugin, {}])
		.add(extensionPlugin)
		.add(tasksAndDecisionsPlugin)
		.add([
			insertBlockPlugin,
			{
				allowExpand: true,
				horizontalRuleEnabled: true,
				nativeStatusSupported: true,
			},
		])
		.add(historyPlugin)
		.add(showDiffPlugin)
		.add(trackChangesPlugin);

function Editor() {
	const { preset, editorApi } = usePreset(createPreset);

	const isSelected = useSharedPluginStateSelector(editorApi, 'trackChanges.isDisplayingChanges');
	const isShowDiffAvailable = useSharedPluginStateSelector(
		editorApi,
		'trackChanges.isShowDiffAvailable',
	);

	return (
		<IntlProvider locale="en">
			<Box xcss={styles.everythingContainer}>
				<Box xcss={styles.aboveEditor}>
					<Button
						appearance="primary"
						onClick={() => {
							editorApi?.core.actions.execute(editorApi?.trackChanges.commands.toggleChanges);
						}}
						isSelected={isSelected}
						isDisabled={!(isShowDiffAvailable ?? false)}
					>
						Show Diff
					</Button>
				</Box>
				<ComposableEditor preset={preset} appearance="comment" />
			</Box>
		</IntlProvider>
	);
}

export default Editor;
