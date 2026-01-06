import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { textColorPlugin } from '@atlaskit/editor-plugin-text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { toolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import { toolbarListsIndentationPlugin } from '@atlaskit/editor-plugin-toolbar-lists-indentation';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import { ChromelessEditor } from '../src/editor-appearances/ChromelessEditor';

const styles = cssMap({
	container: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
		marginLeft: token('space.200'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
	},
	toggle: {
		paddingBlock: token('space.100'),
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
		marginLeft: token('space.200'),
	},
});

export default function Editor(): React.JSX.Element {
	const [isToolbarEnabled, setIsToolbarEnabled] = useState(true);

	const { preset } = usePreset(
		(builder) => {
			return (
				builder
					.add(basePlugin)
					// IMPORTANT: Toolbar plugin must be declared first.
					.add([
						toolbarPlugin,
						{
							// when isToolbarEnabled is false, default to 'always-pinned' for chromeless editor this will just hide all toolbars
							contextualFormattingEnabled: isToolbarEnabled ? 'always-inline' : 'always-pinned',
						},
					])
					.add(textColorPlugin)
					.add(highlightPlugin)
					.add(listPlugin)
					.add([
						toolbarListsIndentationPlugin,
						{ showIndentationButtons: false, allowHeadingAndParagraphIndentation: false },
					])
					.add(hyperlinkPlugin)
					.add(editorDisabledPlugin)
					.add([analyticsPlugin, {}])
					.add(blockTypePlugin)
					.add(copyButtonPlugin)
					.add(decorationsPlugin)
					.add(floatingToolbarPlugin)
					.add(typeAheadPlugin)
					.add(quickInsertPlugin)
					.add(selectionPlugin)
					.add(widthPlugin)
					.add(contentInsertionPlugin)
					.add(guidelinePlugin)
					.add(tablesPlugin)
					.add(textFormattingPlugin)
			);
		},
		[isToolbarEnabled],
	);

	return (
		<Stack space="space.200">
			<Box xcss={styles.toggle}>
				<Inline space="space.100" alignBlock="center">
					<Toggle
						id="toolbar-toggle"
						isChecked={isToolbarEnabled}
						onChange={() => setIsToolbarEnabled(!isToolbarEnabled)}
					/>
					<label htmlFor="toolbar-toggle">Enable Inline Toolbar</label>
				</Inline>
			</Box>
			<Box xcss={styles.container}>
				<ChromelessEditor preset={preset} />
			</Box>
		</Stack>
	);
}
