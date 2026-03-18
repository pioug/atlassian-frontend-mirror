import React, { useCallback, useState } from 'react';

import type { DocNode } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { datePlugin } from '@atlaskit/editor-plugin-date';
import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { annotationPlugin } from '@atlaskit/editor-plugins/annotation';
import type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { captionPlugin } from '@atlaskit/editor-plugins/caption';
import { cardPlugin } from '@atlaskit/editor-plugins/card';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { editorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { extensionPlugin } from '@atlaskit/editor-plugins/extension';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { mediaPlugin } from '@atlaskit/editor-plugins/media';
import { mentionsPlugin } from '@atlaskit/editor-plugins/mentions';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { unsupportedContentPlugin } from '@atlaskit/editor-plugins/unsupported-content';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Mapping, Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { Label } from '@atlaskit/form';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import Textarea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';
import * as cljs from '@atlassian/content-reconciliation';

const headerStyles = cssMap({
	header: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.neutral.subtle'),
		borderBottomWidth: token('border.width'),
		borderBottomStyle: 'solid',
		borderBottomColor: token('color.border'),
	},
	toolbar: {
		position: 'sticky',
		top: token('space.100'),
		zIndex: 800,
		backgroundColor: token('elevation.surface'),
	}
});

const DEFAULT_ORIGINAL_DOC: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Hello world' }],
		},
	],
};

const DEFAULT_NEW_DOC: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [{ type: 'text', text: 'Hello updated world!' }],
		},
	],
};

const LS_KEY_ORIGINAL = 'showDiffExample_originalDoc';
const LS_KEY_NEW = 'showDiffExample_newDoc';

const defaultOriginalStr = JSON.stringify(DEFAULT_ORIGINAL_DOC, null, 2);
const defaultNewStr = JSON.stringify(DEFAULT_NEW_DOC, null, 2);

const loadFromStorage = (key: string, fallback: string): string => {
	try {
		return localStorage.getItem(key) ?? fallback;
	} catch {
		return fallback;
	}
};

const saveToStorage = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch {
		// ignore storage errors
	}
};

const removeFromStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch {
		// ignore storage errors
	}
};

const getStepsDiff = (originalDoc: DocNode, newDoc: DocNode, schema: Schema) => {
	const steps = cljs.create_steps_via_diff(schema, originalDoc, newDoc);
	return mapSteps(steps, schema);
};

const mapSteps = (steps: any[], schema: Schema) => {
	const pmSteps = steps?.map((step: any) => ProseMirrorStep.fromJSON(schema, step));

	const mapping = new Mapping();
	const mappedSteps: ProseMirrorStep[] = [];

	for (const step of pmSteps) {
		const mapResult = step?.map(mapping);

		if (mapResult) {
			mappedSteps.push(mapResult);
			mapping.appendMap(mapResult.getMap());
		}
	}
	return mappedSteps;
};

export default function FullPageDiffEditor(): React.JSX.Element {
	const [originalDocText, setOriginalDocText] = useState(() =>
		loadFromStorage(LS_KEY_ORIGINAL, defaultOriginalStr),
	);
	const [newDocText, setNewDocText] = useState(() => loadFromStorage(LS_KEY_NEW, defaultNewStr));
	const [error, setError] = useState<string | null>(null);

	const { preset, editorApi } = usePreset(
		(builder) =>
			builder
				.add(basePlugin)
				.add(blockTypePlugin)
				.add(focusPlugin)
				.add(typeAheadPlugin)
				.add(quickInsertPlugin)
				.add(selectionPlugin)
				.add(decorationsPlugin)
				.add(layoutPlugin)
				.add(listPlugin)
				.add([analyticsPlugin, {}])
				.add(contentInsertionPlugin)
				.add(widthPlugin)
				.add(statusPlugin)
				.add(guidelinePlugin)
				.add(textFormattingPlugin)
				.add([
					tablesPlugin,
					{
						tableOptions: {
							advanced: true,
							allowColumnResizing: true,
							allowHeaderRow: true,
							allowTableResizing: true,
						},
						isTableScalingEnabled: true,
						dragAndDropEnabled: true,
						allowContextualMenu: true,
						fullWidthEnabled: true,
					},
				])
				.add(emojiPlugin)
				.add(hyperlinkPlugin)
				.add(unsupportedContentPlugin)
				.add(mentionsPlugin)
				.add(panelPlugin)
				.add(rulePlugin)
				.add(tasksAndDecisionsPlugin)
				.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])
				.add(editorDisabledPlugin)
				.add(datePlugin)
				.add(copyButtonPlugin)
				.add(compositionPlugin)
				.add(codeBlockPlugin)
				.add(blockControlsPlugin)
				.add(breakoutPlugin)
				.add(gridPlugin)
				.add(floatingToolbarPlugin)
				.add([cardPlugin, { allowBlockCards: true, allowEmbeds: true }])
				.add([editorViewModePlugin, { mode: 'view' }])
				.add([
					mediaPlugin,
					{
						allowMediaSingle: { disableLayout: false },
						allowMediaGroup: true,
						allowResizing: true,
						isCopyPasteEnabled: true,
						allowBreakoutSnapPoints: true,
						allowAdvancedToolBarOptions: true,
						allowDropzoneDropLine: true,
						allowMediaSingleEditable: true,
						allowImagePreview: true,
						fullWidthEnabled: true,
						waitForMediaUpload: true,
						allowCaptions: true,
					},
				])
				.add(captionPlugin)
				.add([
					annotationPlugin,
					{
						inlineComment: {},
					} as AnnotationProviders,
				])
				.add(extensionPlugin)
				.add([
					showDiffPlugin,
					{
						colorScheme: 'traditional',
						originalDoc: { content: [], version: 1, type: 'doc' },
						steps: [],
					},
				]),
		[],
	);

	const { numberOfChanges, activeIndex } = useSharedPluginStateWithSelector(
		editorApi,
		['showDiff'],
		({ showDiffState }) => ({
			numberOfChanges: showDiffState?.numberOfChanges ?? 0,
			activeIndex: showDiffState?.activeIndex,
		}),
	);

	const handleScrollToNext = useCallback(() => {
		editorApi?.core?.actions.execute(editorApi?.showDiff?.commands.scrollToNext);
	}, [editorApi]);

	const handleScrollToPrevious = useCallback(() => {
		editorApi?.core?.actions.execute(editorApi?.showDiff?.commands.scrollToPrevious);
	}, [editorApi]);

	const handleComputeDiff = useCallback(() => {
		setError(null);
		try {
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			const schema = editorApi?.core.sharedState.currentState()?.schema!;
			const transformer = new JSONTransformer(schema);

			const originalDocJson: DocNode = JSON.parse(originalDocText);
			const newDocJson: DocNode = JSON.parse(newDocText);

			// Validate documents via JSONTransformer (throws if invalid ADF)
			const originalNode = transformer.parse(originalDocJson);
			transformer.parse(newDocJson);

			// Update the editor document to the new doc before showing the diff
			editorApi?.core?.actions.replaceDocument(newDocJson);

			const steps = getStepsDiff(originalDocJson, newDocJson, schema);

			editorApi?.core?.actions.execute(
				editorApi?.showDiff?.commands.showDiff({
					originalDoc: originalNode,
					steps,
				}),
			);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Invalid JSON input');
		}
	}, [originalDocText, newDocText, editorApi]);

	const handleHideDiff = useCallback(() => {
		editorApi?.core?.actions.execute(editorApi?.showDiff?.commands.hideDiff);
	}, [editorApi]);

	const handleClear = useCallback(() => {
		removeFromStorage(LS_KEY_ORIGINAL);
		removeFromStorage(LS_KEY_NEW);
		setOriginalDocText(defaultOriginalStr);
		setNewDocText(defaultNewStr);
		editorApi?.core?.actions.execute(editorApi?.showDiff?.commands.hideDiff);
		editorApi?.core?.actions.replaceDocument(DEFAULT_NEW_DOC);
		setError(null);
	}, [editorApi]);

	return (
		<Stack space="space.200">
			<Box xcss={headerStyles.header}>
				<Inline space="space.200" grow="fill">
					<Stack space="space.100" grow="fill">
						<Label htmlFor="originalDoc">Original Document (ADF JSON)</Label>
						<Textarea
							id="originalDoc"
							value={originalDocText}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								setOriginalDocText(e.target.value);
								saveToStorage(LS_KEY_ORIGINAL, e.target.value);
							}}
							isMonospaced
							minimumRows={10}
						/>
					</Stack>
					<Stack space="space.100" grow="fill">
						<Label htmlFor="newDoc">New Document (ADF JSON)</Label>
						<Textarea
							id="newDoc"
							value={newDocText}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								setNewDocText(e.target.value);
								saveToStorage(LS_KEY_NEW, e.target.value);
							}}
							isMonospaced
							minimumRows={10}
						/>
					</Stack>
				</Inline>
			</Box>

			<Box paddingInline="space.200" xcss={headerStyles.toolbar}>
				<Inline space="space.100" alignBlock="center">
					<Button appearance="primary" onClick={handleComputeDiff}>
						Compute Diff
					</Button>
					<Button onClick={handleHideDiff}>Hide Diff</Button>
					<Button onClick={handleClear}>Clear</Button>
					<Button onClick={handleScrollToPrevious} isDisabled={numberOfChanges === 0}>
						Previous
					</Button>
					<Button onClick={handleScrollToNext} isDisabled={numberOfChanges === 0}>
						Next
					</Button>
					<Text color="color.text.subtle">
						{numberOfChanges > 0
							? `Change ${(activeIndex ?? 0) + 1} of ${numberOfChanges}`
							: 'No changes'}
					</Text>
				</Inline>
			</Box>

			{error && (
				<Box paddingInline="space.200">
					<SectionMessage title="Error" appearance="error">
						<Text color="color.text.danger">{error}</Text>
					</SectionMessage>
				</Box>
			)}

			<ComposableEditor appearance="full-page" preset={preset} defaultValue={DEFAULT_NEW_DOC} />
		</Stack>
	);
}
