/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';
import { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';
import { compositionPlugin } from '@atlaskit/editor-plugins/composition';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';
import { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';
import { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';
import { editorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';
import { emojiPlugin } from '@atlaskit/editor-plugins/emoji';
import { expandPlugin } from '@atlaskit/editor-plugins/expand';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { gridPlugin } from '@atlaskit/editor-plugins/grid';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';
import { layoutPlugin } from '@atlaskit/editor-plugins/layout';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { panelPlugin } from '@atlaskit/editor-plugins/panel';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { rulePlugin } from '@atlaskit/editor-plugins/rule';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { showDiffPlugin } from '@atlaskit/editor-plugins/show-diff';
import { tablesPlugin } from '@atlaskit/editor-plugins/table';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { widthPlugin } from '@atlaskit/editor-plugins/width';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import type { ColorScheme, DiffType } from '../src/showDiffPluginType';

import {
	type CustomScenario,
	emptyDoc,
	MiniEditor,
	type MiniEditorHandle,
} from './utils/scenario-helpers';

const diffTypes: DiffType[] = ['smart', 'inline', 'block', 'step'];

/**
 * A cheap, stable content signature for a scenario. Used only as part of a React `key` so
 * a scenario card remounts (and re-runs its diff) when its before/after/label change on
 * save. Not a cryptographic hash — collisions are harmless here.
 */
const scenarioSignature = (scenario: CustomScenario): string => {
	const str = `${scenario.label}|${JSON.stringify(scenario.before)}|${JSON.stringify(scenario.after)}`;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) | 0;
	}
	return String(hash >>> 0);
};

const STORAGE_KEY = 'editor-plugin-show-diff.custom-scenarios.v1';

/** Load persisted scenarios from localStorage. Returns [] if unavailable/invalid. */
const loadScenarios = (): CustomScenario[] => {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			return [];
		}
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}
		// Keep only well-formed entries.
		return parsed.filter(
			(s): s is CustomScenario => s && typeof s.label === 'string' && s.before && s.after,
		);
	} catch {
		return [];
	}
};

/** Persist scenarios to localStorage (best-effort). */
const saveScenarios = (scenarios: CustomScenario[]): void => {
	try {
		if (typeof window === 'undefined' || !window.localStorage) {
			return;
		}
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
	} catch {
		// Ignore quota / serialization errors — persistence is a convenience, not critical.
	}
};

const styles = cssMap({
	page: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	builder: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.small'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	row: {
		display: 'flex',
		alignItems: 'stretch',
		flexWrap: 'wrap',
	},
	pane: {
		flex: '1 1 320px',
		minWidth: '280px',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	controls: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'flex-end',
		flexWrap: 'wrap',
	},
	labelField: {
		flex: '1 1 260px',
	},
	scenarioCard: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	scenarioHeader: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},
	scenarioControls: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	emptyState: {
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
		textAlign: 'center',
	},
});

/**
 * Renders a single custom scenario in its own read-only editor with the diff applied.
 * The scenario's `before` doc is the original; `after` is the current doc; the change is
 * expressed as one ReplaceStep per changed top-level block run.
 */
function ScenarioDiff({
	scenario,
	index,
	colorScheme,
	diffType,
	hideDeletedDiffs,
	onRemove,
	onUpdate,
}: {
	colorScheme: ColorScheme;
	diffType: DiffType;
	hideDeletedDiffs: boolean;
	index: number;
	onRemove: () => void;
	onUpdate: (updated: CustomScenario) => void;
	scenario: CustomScenario;
}): React.JSX.Element {
	const [isEditing, setIsEditing] = useState(false);
	const [editLabel, setEditLabel] = useState(scenario.label);
	const editBeforeRef = React.useRef<MiniEditorHandle>(null);
	const editAfterRef = React.useRef<MiniEditorHandle>(null);

	const handleStartEdit = useCallback(() => {
		setEditLabel(scenario.label);
		setIsEditing(true);
	}, [scenario.label]);

	const handleCancelEdit = useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleSaveEdit = useCallback(() => {
		onUpdate({
			label: editLabel.trim(),
			before: editBeforeRef.current?.getDoc() ?? scenario.before,
			after: editAfterRef.current?.getDoc() ?? scenario.after,
		});
		setIsEditing(false);
	}, [editLabel, onUpdate, scenario.before, scenario.after]);

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
				.add(guidelinePlugin)
				.add(textFormattingPlugin)
				.add([tablesPlugin, { tableOptions: { advanced: true, allowHeaderRow: true } }])
				.add(emojiPlugin)
				.add(hyperlinkPlugin)
				.add(panelPlugin)
				.add(rulePlugin)
				.add(tasksAndDecisionsPlugin)
				.add([expandPlugin, { allowInsertion: true }])
				.add(editorDisabledPlugin)
				.add(copyButtonPlugin)
				.add(compositionPlugin)
				.add(codeBlockPlugin)
				.add(blockControlsPlugin)
				.add(breakoutPlugin)
				.add(gridPlugin)
				.add(floatingToolbarPlugin)
				.add([editorViewModePlugin, { mode: 'view' }])
				.add([showDiffPlugin, { colorScheme, steps: [], originalDoc: scenario.before }]),
		[colorScheme, scenario.before],
	);

	const { numberOfChanges } = useSharedPluginStateWithSelector(
		editorApi,
		['showDiff'],
		({ showDiffState }) => ({ numberOfChanges: showDiffState?.numberOfChanges ?? 0 }),
	);

	useEffect(() => {
		if (!editorApi) {
			return;
		}
		const state = editorApi.core.sharedState.currentState();
		if (!state?.schema) {
			return;
		}
		const schema = state.schema;
		const originalDoc = processRawValue(schema, scenario.before);
		const currentDoc = processRawValue(schema, scenario.after);
		if (!originalDoc || !currentDoc) {
			return;
		}
		// Model the whole before→after change as a single ReplaceStep over the doc body.
		const slice = currentDoc.slice(0, currentDoc.content.size);
		const step = new ReplaceStep(0, originalDoc.content.size, slice);
		const steps = [step];
		editorApi.core.actions.execute(
			editorApi.showDiff.commands.showDiff({
				steps,
				originalDoc,
				hideDeletedDiffs,
				diffType,
			}),
		);
	}, [editorApi, scenario.before, scenario.after, hideDeletedDiffs, diffType]);

	return (
		<div css={styles.scenarioCard}>
			<div css={styles.scenarioHeader}>
				<Text weight="bold">
					Scenario {index + 1}: {scenario.label || 'Untitled'}
				</Text>
				<div css={styles.scenarioControls}>
					{isEditing ? (
						<>
							<Button appearance="primary" onClick={handleSaveEdit}>
								Save
							</Button>
							<Button appearance="subtle" onClick={handleCancelEdit}>
								Cancel
							</Button>
						</>
					) : (
						<>
							<Text color="color.text.subtle">
								{numberOfChanges > 0 ? `${numberOfChanges} change(s)` : 'No changes'}
							</Text>
							<Button appearance="subtle" onClick={handleStartEdit}>
								Edit
							</Button>
							<Button appearance="subtle" onClick={onRemove}>
								Remove
							</Button>
						</>
					)}
				</div>
			</div>

			{isEditing ? (
				<>
					<div css={styles.labelField}>
						<TextField
							placeholder="Scenario label"
							value={editLabel}
							onChange={(e) => setEditLabel((e.target as HTMLInputElement).value)}
						/>
					</div>
					<div css={styles.row}>
						<div css={styles.pane}>
							<Text weight="medium">Before</Text>
							<MiniEditor ref={editBeforeRef} defaultValue={scenario.before} />
						</div>
						<div css={styles.pane}>
							<Text weight="medium">After</Text>
							<MiniEditor ref={editAfterRef} defaultValue={scenario.after} />
						</div>
					</div>
				</>
			) : (
				<ComposableEditor appearance="comment" defaultValue={scenario.after} preset={preset} />
			)}
		</div>
	);
}

/**
 * Example page for authoring custom before/after diff scenarios. Users build a scenario in
 * the builder, and each saved scenario is rendered below in its own diff editor. Scenarios
 * are persisted to localStorage so they survive reloads.
 */
export default function Editor(): React.JSX.Element {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('standard');
	const [hideDeletedDiffs, setHideDeletedDiffs] = useState(false);
	const [diffType, setDiffType] = useState<DiffType>('smart');

	// Initialise from localStorage so scenarios survive page reloads.
	const [scenarios, setScenarios] = useState<CustomScenario[]>(() => loadScenarios());
	const [scenarioLabel, setScenarioLabel] = useState('');

	// Persist whenever the scenario list changes.
	useEffect(() => {
		saveScenarios(scenarios);
	}, [scenarios]);
	const beforeEditorRef = React.useRef<MiniEditorHandle>(null);
	const afterEditorRef = React.useRef<MiniEditorHandle>(null);
	const [builderKey, setBuilderKey] = useState(0);

	const handleAddScenario = useCallback(() => {
		// Pull the *current* doc from each editor imperatively (not via debounced onChange).
		const before = beforeEditorRef.current?.getDoc() ?? emptyDoc;
		const after = afterEditorRef.current?.getDoc() ?? emptyDoc;
		setScenarios((prev) => [...prev, { label: scenarioLabel.trim(), before, after }]);
		setScenarioLabel('');
		setBuilderKey((k) => k + 1);
	}, [scenarioLabel]);

	const handleRemoveScenario = useCallback((index: number) => {
		setScenarios((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleUpdateScenario = useCallback((index: number, updated: CustomScenario) => {
		setScenarios((prev) => prev.map((s, i) => (i === index ? updated : s)));
	}, []);

	return (
		<div css={styles.page}>
			<Text as="p" size="large" weight="bold">
				Custom scenarios — one diff editor per scenario
			</Text>
			<Text as="p" color="color.text.subtle">
				Author a BEFORE and AFTER document, label it, and click “Add scenario”. Each scenario is
				rendered below in its own editor with the diff applied (one ReplaceStep per changed block).
				Use the controls to switch diff type, colour scheme, and deleted-diff visibility for all
				scenarios.
			</Text>

			{/* Global diff controls */}
			<div css={styles.controls}>
				<Button
					onClick={() => setColorScheme(colorScheme === 'traditional' ? 'standard' : 'traditional')}
				>
					Colour scheme: {colorScheme}
				</Button>
				<Button onClick={() => setHideDeletedDiffs((p) => !p)}>
					Deleted diffs: {hideDeletedDiffs ? 'hidden' : 'visible'}
				</Button>
				<Button
					onClick={() => {
						const next = (diffTypes.indexOf(diffType) + 1) % diffTypes.length;
						setDiffType(diffTypes[next] ?? 'smart');
					}}
				>
					Type: {diffType}
				</Button>
				<Button
					appearance="warning"
					onClick={() => setScenarios([])}
					isDisabled={scenarios.length === 0}
				>
					Clear all ({scenarios.length})
				</Button>
			</div>

			{/* Scenario builder */}
			<div css={styles.builder}>
				<Text weight="bold">Add a custom scenario</Text>
				<div css={styles.row}>
					<div css={styles.pane}>
						<Text weight="medium">Before</Text>
						<MiniEditor
							key={`before-${builderKey}`}
							ref={beforeEditorRef}
							defaultValue={emptyDoc}
						/>
					</div>
					<div css={styles.pane}>
						<Text weight="medium">After</Text>
						<MiniEditor key={`after-${builderKey}`} ref={afterEditorRef} defaultValue={emptyDoc} />
					</div>
				</div>
				<div css={styles.controls}>
					<div css={styles.labelField}>
						<TextField
							placeholder="Scenario label (e.g. My table edit)"
							value={scenarioLabel}
							onChange={(e) => setScenarioLabel((e.target as HTMLInputElement).value)}
						/>
					</div>
					<Button appearance="primary" onClick={handleAddScenario}>
						Add scenario
					</Button>
				</div>
			</div>

			{/* Rendered scenarios — each in its own diff editor */}
			{scenarios.length === 0 ? (
				<div css={styles.emptyState}>
					<Text color="color.text.subtle">No scenarios yet. Add one above to see its diff.</Text>
				</div>
			) : (
				scenarios.map((scenario, index) => (
					<ScenarioDiff
						// Key includes the diff type and a content signature so the read-only diff
						// editor remounts (and re-diffs) when the scenario is edited/saved or the
						// diff type changes.
						key={`scenario-${index}-${diffType}-${scenarioSignature(scenario)}`}
						scenario={scenario}
						index={index}
						colorScheme={colorScheme}
						diffType={diffType}
						hideDeletedDiffs={hideDeletedDiffs}
						onRemove={() => handleRemoveScenario(index)}
						onUpdate={(updated) => handleUpdateScenario(index, updated)}
					/>
				))
			)}
		</div>
	);
}
