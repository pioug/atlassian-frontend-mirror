/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useState, useMemo, useRef } from 'react';

import { jsx, cssMap } from '@compiled/react';
import applyDevTools from 'prosemirror-dev-tools';
import { IntlProvider } from 'react-intl';

import {
	useConfluenceFullPagePreset,
	getExamplesProviders,
} from '@af/editor-examples-helpers/example-presets';
import Button from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Inline } from '@atlaskit/primitives/compiled';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { token } from '@atlaskit/tokens';

import { getBaselineFromSteps, trackChangesPluginKey } from '../src/pm-plugins/main';

const styles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		minHeight: 0,
		height: '100%',
	},
	toolbar: {
		paddingTop: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
	},
	editor: {
		flex: 1,
		minHeight: 0,
	},
});

// ---------------------------------------------------------------------------
// Diff type cycle
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Editor component
// ---------------------------------------------------------------------------

function Editor(): React.JSX.Element {
	// ------------------------------------------------------------------
	// Editor view ref
	// ------------------------------------------------------------------
	const editorViewRef = useRef<EditorView | null>(null);

	// ------------------------------------------------------------------
	// State — pmParams
	// ------------------------------------------------------------------
	const [isInverted, setIsInverted] = useState(false);
	const [hideDeletedDiffs, setHideDeletedDiffs] = useState(false);
	const [showIndicators, setShowIndicators] = useState(true);

	// ------------------------------------------------------------------
	// State — diff UI
	// ------------------------------------------------------------------
	const [isShowingDiff, setIsShowingDiff] = useState(false);

	// ------------------------------------------------------------------
	// Preset
	// ------------------------------------------------------------------
	const providers = React.useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);
	const mockedCollabEditProvider = useMemo(
		() =>
			createCollabEditProvider({
				userId: 'user-1',
			}),
		[],
	);

	const { preset, editorApi } = useConfluenceFullPagePreset(
		{
			editorAppearance: 'full-page',
			overridedFullPagePresetProps: {
				providers,
				enabledOptionalPlugins: {
					showDiff: true,
					trackChanges: true,
				},
			},
		},
		[providers],
	);

	// ------------------------------------------------------------------
	// Shared plugin state
	// ------------------------------------------------------------------
	const { isShowDiffAvailable } = useSharedPluginStateWithSelector(
		editorApi,
		['showDiff', 'trackChanges'],
		({ showDiffState, trackChangesState }) => ({
			isShowDiffAvailable: trackChangesState?.isShowDiffAvailable ?? false,
		}),
	);

	// ------------------------------------------------------------------
	// Show / hide diff
	// ------------------------------------------------------------------
	const showDiff = useCallback(() => {
		const editorState = editorViewRef.current?.state;
		if (!editorState) {
			return;
		}

		const pluginState = trackChangesPluginKey.getState(editorState);
		if (!pluginState) {
			return;
		}
		const { steps } = pluginState;
		const originalDoc = getBaselineFromSteps(editorState.doc, steps);
		if (!originalDoc) {
			return;
		}

		editorApi?.core.actions.execute(
			editorApi?.showDiff?.commands.showDiff({
				steps: steps.map((s) => s.step),
				originalDoc,
				isInverted,
				hideDeletedDiffs,
				diffType: 'step',
				showIndicators,
			}),
		);
		setIsShowingDiff(true);
	}, [editorApi, isInverted, hideDeletedDiffs, showIndicators]);

	const hideDiff = useCallback(() => {
		editorApi?.core.actions.execute(editorApi?.trackChanges?.commands.resetBaseline);
		editorApi?.core.actions.execute(editorApi?.showDiff?.commands.hideDiff);
		setIsShowingDiff(false);
	}, [editorApi]);

	// ------------------------------------------------------------------
	// pmParam toggle helpers
	// ------------------------------------------------------------------

	const toggleInverted = useCallback(() => {
		hideDiff();
		setIsInverted((prev) => !prev);
	}, [hideDiff]);

	const toggleHideDeletedDiffs = useCallback(() => {
		hideDiff();
		setHideDeletedDiffs((prev) => !prev);
	}, [hideDiff]);

	const toggleShowIndicators = useCallback(() => {
		hideDiff();
		setShowIndicators((prev) => !prev);
	}, [hideDiff]);

	// ------------------------------------------------------------------
	// Render
	// ------------------------------------------------------------------
	return (
		<IntlProvider locale="en">
			<div css={styles.container}>
				<Inline xcss={styles.toolbar} space="space.100" shouldWrap alignBlock="center">
					{/* pmParam toggles */}
					<Button onClick={toggleInverted}>Inverted: {isInverted ? 'on' : 'off'}</Button>
					<Button onClick={toggleHideDeletedDiffs}>
						Deleted: {hideDeletedDiffs ? 'hidden' : 'visible'}
					</Button>
					<Button onClick={toggleShowIndicators}>
						Indicators: {showIndicators ? 'on' : 'off'}
					</Button>

					<Button
						appearance="primary"
						onClick={isShowingDiff ? hideDiff : showDiff}
						isDisabled={!isShowingDiff && !isShowDiffAvailable}
					>
						{isShowingDiff ? 'Hide diff' : 'Show diff'}
					</Button>
				</Inline>

				<div css={styles.editor}>
					<ComposableEditor
						appearance="full-page"
						onChange={(view) => {
							editorViewRef.current = view;
							applyDevTools(view);
						}}
						preset={preset}
						collabEdit={{ provider: mockedCollabEditProvider }}
					/>
				</div>
			</div>
		</IntlProvider>
	);
}

export default Editor;
