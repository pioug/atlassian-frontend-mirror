import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset/builder';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/useSharedPluginStateSelector';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPlugin';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type/blockTypePlugin';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block/codeBlockPlugin';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition/compositionPlugin';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion/contentInsertionPlugin';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button/copyButtonPlugin';
import { datePlugin } from '@atlaskit/editor-plugin-date/datePlugin';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPlugin';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPlugin';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji/emojiPlugin';
import { expandPlugin } from '@atlaskit/editor-plugin-expand/plugin';
import { extensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPlugin';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar/floatingToolbarPlugin';
import { focusPlugin } from '@atlaskit/editor-plugin-focus/focusPlugin';
import { gridPlugin } from '@atlaskit/editor-plugin-grid/gridPlugin';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline/guidelinePlugin';
import { historyPlugin } from '@atlaskit/editor-plugin-history/historyPlugin';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink/hyperlinkPlugin';
import { imageUploadPlugin } from '@atlaskit/editor-plugin-image-upload/imageUploadPlugin';
import { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block/insert-block-plugin';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout/layout-plugin';
import { listPlugin } from '@atlaskit/editor-plugin-list/list-plugin';
import { mediaPlugin } from '@atlaskit/editor-plugin-media/media-plugin';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions/mentions-plugin';
import { panelPlugin } from '@atlaskit/editor-plugin-panel/panel-plugin';
import { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text/placeholder-text-plugin';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert/quick-insert-plugin';
import { rulePlugin } from '@atlaskit/editor-plugin-rule/rule-plugin';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff/show-diff-plugin';
import { statusPlugin } from '@atlaskit/editor-plugin-status/status-plugin';
import { tablePlugin as tablesPlugin } from '@atlaskit/editor-plugin-table/table-plugin';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions/tasks-and-decisions-plugin';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin';
import { widthPlugin } from '@atlaskit/editor-plugin-width/width-plugin';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { trackChangesPlugin } from '../src/trackChangesPlugin';

const styles = cssMap({
	aboveEditor: {
		position: 'fixed',
		bottom: 0,
		zIndex: 800,
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
		.add(hyperlinkPlugin)
		.add(datePlugin)
		.add(listPlugin)
		.add(blockTypePlugin)
		.add(imageUploadPlugin)
		.add([emojiPlugin, { emojiProvider: getEmojiResource() }])
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
		.add(textFormattingPlugin)
		.add([tablesPlugin, { tableOptions: { advanced: true } }])
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

function Editor(): React.JSX.Element {
	const { preset, editorApi } = usePreset(createPreset);

	const isSelected = useSharedPluginStateSelector(editorApi, 'trackChanges.isDisplayingChanges');
	const activeIndex = useSharedPluginStateSelector(editorApi, 'showDiff.activeIndex');
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
					<Button
						appearance="primary"
						onClick={() => {
							editorApi?.core.actions.execute(editorApi?.showDiff.commands.scrollToNext);
						}}
					>
						Next
					</Button>
					<Button
						appearance="primary"
						onClick={() => {
							editorApi?.core.actions.execute(editorApi?.showDiff.commands.scrollToPrevious);
						}}
					>
						Previous
					</Button>
					<Button>{activeIndex}</Button>
				</Box>
				<ComposableEditor preset={preset} appearance="comment" />
			</Box>
		</IntlProvider>
	);
}

export default Editor;
