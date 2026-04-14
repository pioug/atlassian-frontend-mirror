import React, { useCallback, useState } from 'react';

import { IntlProvider, useIntl } from 'react-intl-next';

import type { DocNode } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { processRawValueWithoutValidation } from '@atlaskit/editor-common/process-raw-value';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Mapping, Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { Label } from '@atlaskit/form';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';
import Textarea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';
import { fullPagePreset } from '@atlassian/confluence-presets/full-page';
import * as cljs from '@atlassian/content-reconciliation';
import { createPromptEditor } from '@atlassian/editor-ai-injected-editors/prompt-editor';
import { createPageEditorPluginAIOptions } from '@atlassian/editor-plugin-ai/ConfluencePrebuilt';

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
	},
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
	const originalTransformed = processRawValueWithoutValidation(schema, originalDoc);
	const newTransformed = processRawValueWithoutValidation(schema, newDoc);
	const steps = cljs.create_steps_via_diff(
		schema,
		originalTransformed?.toJSON() ?? originalDoc,
		newTransformed?.toJSON() ?? newDoc,
	);
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

const editorPluginAIOptions = createPageEditorPluginAIOptions({
	product: 'CONFLUENCE',
	aiGlobalOptIn: { status: 'enabled', triggerOptInFlow: () => {} },
	objectId: 'test-object-id',
	PromptEditor: createPromptEditor({
		linking: {
			smartLinks: {},
		},
		featureFlags: {},
	}),
	isRovoEnabled: true,
	onSubmit: () => {},
});

function FullPageDiffEditor(): React.JSX.Element {
	const intl = useIntl();
	const [originalDocText, setOriginalDocText] = useState(() =>
		loadFromStorage(LS_KEY_ORIGINAL, defaultOriginalStr),
	);
	const [newDocText, setNewDocText] = useState(() => loadFromStorage(LS_KEY_NEW, defaultNewStr));
	const [error, setError] = useState<string | null>(null);

	const { preset, editorApi } = usePreset(
		() =>
			fullPagePreset({
				intl,
				pluginOptions: {
					base: {
						__livePage: false,
					},
					hyperlink: {
						editorAppearance: 'full-page',
						linkPicker: undefined,
						onClickCallback: undefined,
					},
					helpDialog: {
						imageUploadProviderExists: false,
						aiEnabled: false,
					},
					quickInsert: {
						emptyStateHandler: undefined,
					},
					placeholder: {
						viewMode: 'edit',
						isAIEnabled: false,
						isRovoLLMEnabled: false,
					},
					selection: {
						__livePage: false,
					},
					breakout: {
						editorAppearance: 'full-page',
					},
					expand: {
						editorAppearance: 'full-page',
						__livePage: false,
					},
					editorDisabled: {
						disabled: undefined,
					},
					annotation: {
						annotationManager: undefined,
						createCommentExperience: undefined,
						selectCommentExperience: undefined,
						viewInlineCommentTraceUFOPress: undefined,
					},
					media: {
						createCommentExperience: undefined,
						editorAppearance: 'full-page',
						mediaViewerExtensions: undefined,
					},
					mentions: {
						handleMentionsChanged: () => {},
					},
					table: {
						editorAppearance: 'full-page',
						prevEditorAppearance: 'full-page',
					},
					tasksAndDecisions: {
						hasEditPermission: true,
						requestToEditContent: undefined,
						hasRequestedEditPermission: undefined,
					},
					collabEdit: {
						collabEdit: undefined,
						__livePage: false,
					},
					contextPanel: undefined,
					extension: {
						editorAppearance: 'full-page',
					},
					layout: {
						editorAppearance: 'full-page',
					},
					card: {
						editorAppearance: 'full-page',
						__livePage: false,
						linkPicker: undefined,
						onClickCallback: undefined,
						CompetitorPrompt: undefined,
					},
					insertBlock: {
						editorAppearance: 'full-page',
						toolbarButtons: {
							emoji: { enabled: true, showAt: 'lg' },
							insert: { enabled: true, showAt: 'lg' },
							layout: { enabled: true, showAt: 'lg' },
							media: { enabled: true, showAt: 'lg' },
							mention: { enabled: true, showAt: 'lg' },
							table: { enabled: true, showAt: 'md' },
							taskList: { enabled: true, showAt: 'lg' },
						},
					},
					avatarGroup: {
						collabEdit: undefined,
					},
					codeBidiWarning: {
						editorAppearance: 'full-page',
					},
					loom: {
						renderButton: () => null,
					},
					editorViewMode: {
						viewMode: 'edit',
					},
					limitedMode: {
						killSwitchEnabled: true,
					},
					engagementPlatform: {
						coordinationClient: {
							start: () => Promise.resolve(false),
							stop: () => Promise.resolve(false),
						},
					},
					selectionExtension: {},
					metrics: {},
					primaryToolbar: {
						contextualFormattingEnabled: true,
					},
					selectionToolbar: {
						contextualFormattingEnabled: true,
					},
					selectionMarker: {
						__livePage: false,
					},
					userPreferencesPlugin: {
						initialToolbarDockingPosition: undefined,
					},
					ai: editorPluginAIOptions,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					aiDefinitions: {} as any,
					referentiality: {
						referentialityContext: {
							api: null,
							options: {},
						},
					},
					blockMenu: {
						getLinkPath: () => '/some/path',
						blockLinkHashPrefix: '',
					},
					contentFormat: undefined,
					syncedBlock: undefined,
					toolbar: {
						contextualFormattingEnabled: 'controlled',
					},
					trackChanges: undefined,
					showDiff: {
						colorScheme: 'traditional',
						originalDoc: { content: [], version: 1, type: 'doc' },
						steps: [],
					},
				},
				providers: {
					autoformattingProvider: undefined,
					cardProvider: undefined,
					collabEditProvider: undefined,
					contextIdentifierProvider: undefined,
					emojiNodeDataProvider: undefined,
					emojiProvider: undefined,
					inlineCommentAnnotationProvider: undefined,
					mediaProvider: undefined,
					mentionProvider: undefined,
					profilecardProvider: undefined,
					syncMediaProvider: undefined,
					taskDecisionProvider: undefined,
					userPreferencesProvider: undefined,
				},
				enabledOptionalPlugins: {
					limitedMode: false,
					findReplace: true,
					referentiality: false,
					loom: false,
					aiExperience: false,
					aiDefinitions: false,
					connectivity: true,
					metrics: false,
					codeBlockAdvanced: true,
					selectionExtension: false,
					interaction: false,
					floatingToolbar: true,
					userPreferences: true,
					showDiff: true,
					trackChanges: true,
					toolbar: true,
					blockMenu: true,
					localId: true,
					aiStreamingOrchestrator: false,
					syncedBlock: false,
					codeBidiWarning: false,
					contentFormat: false,
					uiControlRegistry: true,
				},
			}),
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
			const originalNode = processRawValueWithoutValidation(schema, originalDocJson)!;
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

export default function FullPageDiffEditorExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<FullPageDiffEditor />
		</IntlProvider>
	);
}
