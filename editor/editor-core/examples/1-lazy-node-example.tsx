import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash/debounce';

import {
	lazyNodeViewDecorationPluginKey,
	testOnlyIgnoreLazyNodeView,
} from '@atlaskit/editor-common/lazy-node-view';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports
import type { EditorActions } from '@atlaskit/editor-core';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { createDefaultPreset } from '@atlaskit/editor-core/preset-default';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { extensionPlugin } from '@atlaskit/editor-plugin-extension';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import Heading from '@atlaskit/heading';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { Flex, Stack } from '@atlaskit/primitives';

const createExamplePreset = () => {
	return createDefaultPreset({})
		.add(guidelinePlugin)
		.add(gridPlugin)
		.add(tasksAndDecisionsPlugin)
		.add([extensionPlugin, { extensionHandlers }])
		.add([
			mediaPlugin,
			{
				allowMediaSingle: true,
				allowMediaGroup: true,
				allowMediaInlineImages: true,
				featureFlags: { mediaInline: true },
				provider: storyMediaProviderFactory(),
			},
		]);
};

const EditorWithNodeViewFallbacked = memo(
	({
		adf,
		appearance,
		onReady,
	}: {
		adf?: Object;
		appearance: EditorAppearance;
		onReady: () => void;
	}) => {
		const onEditorReady = useCallback(
			(editorActions: EditorActions) => {
				// @ts-ignore - editorView is "private"
				const view = editorActions.editorView;
				if (!view) {
					return;
				}

				testOnlyIgnoreLazyNodeView(view);

				// This function runs inside a Docker VM with Chrome only
				// eslint-disable-next-line compat/compat
				window.requestIdleCallback(
					() => {
						onReady();
					},
					{ timeout: 4000 },
				);
			},
			[onReady],
		);

		const { preset, editorApi } = usePreset(createExamplePreset);

		useEffect(() => {
			if (!editorApi || !adf) {
				return;
			}

			editorApi.core?.actions.execute(({ tr }: { tr: Transaction }) => {
				const doc = PMNode.fromJSON(tr.doc.type.schema, adf);

				tr.replaceWith(0, tr.doc.nodeSize - 2, doc.content);
				return tr;
			});
		}, [editorApi, adf]);

		return (
			<ComposableEditor preset={preset} appearance={appearance} onEditorReady={onEditorReady} />
		);
	},
);

const EditorWithhRealNodeView = memo(
	({
		appearance,
		onReady,
		onDocChange,
	}: {
		appearance: EditorAppearance;
		onReady: () => void;
		onDocChange: (doc: PMNode) => void;
	}) => {
		const onEditorReady = useCallback(
			(editorActions: EditorActions) => {
				// @ts-ignore - editorView is "private"
				const view = editorActions.editorView;
				if (!view) {
					return;
				}
				// DO NOT REPEAT THIS KIND OF CODE ANYWHERE ON PRODUCTION
				const originalViewDispatch = view.dispatch.bind(view);
				view.dispatch = (tr: Transaction) => {
					const meta = tr.getMeta(lazyNodeViewDecorationPluginKey);
					if (meta) {
						// This function runs inside a Docker VM with Chrome only
						// eslint-disable-next-line compat/compat
						window.requestIdleCallback(
							() => {
								onReady();
							},
							{ timeout: 4000 },
						);
					}
					originalViewDispatch(tr);
				};
			},
			[onReady],
		);

		const { preset, editorApi } = usePreset(createExamplePreset);
		const docRef = useRef<PMNode | undefined>();

		const onChange = useCallback(
			(editorView: EditorView) => {
				if (!editorApi) {
					return;
				}

				if (!docRef.current) {
					docRef.current = editorView.state.doc;
					onDocChange(docRef.current);
				} else if (!docRef.current.eq(editorView.state.doc)) {
					docRef.current = editorView.state.doc;
					onDocChange(docRef.current);
				}
			},
			[editorApi, onDocChange],
		);

		return (
			<ComposableEditor
				preset={preset}
				appearance={appearance}
				onEditorReady={onEditorReady}
				onChange={onChange}
			/>
		);
	},
);

const LazyNodeViewComparison = memo(
	({ name, appearance }: { name: string; appearance: EditorAppearance }) => {
		const [liveAdf, setLiveADF] = useState(undefined);

		const [mockedReady, setMockedReady] = useState(false);
		const [notMockedReady, setNotMockedReady] = useState(false);

		const onNotMockedReady = useCallback(() => {
			setNotMockedReady(true);
		}, []);

		const onMockedReady = useCallback(() => {
			setMockedReady(true);
		}, []);
		setBooleanFeatureFlagResolver((ffName) => {
			if (ffName === 'platform_editor_lazy-node-views') {
				return true;
			}

			return false;
		});
		const onDocChange = useMemo(
			() =>
				debounce((doc: PMNode) => {
					setLiveADF(doc.toJSON());
				}, 100),
			[],
		);
		// After both Editors are settled we can set the test id
		// This is to force Gemini to wait for the whole page get rendered
		const testid = mockedReady && notMockedReady ? 'lazy-node-view-vr-test-is-ready' : 'not-ready';

		return (
			<div data-testid={testid}>
				<Flex>
					<Stack grow="fill">
						<Heading size="medium">Main Editor</Heading>
						<EditorWithhRealNodeView
							appearance={appearance}
							onReady={onNotMockedReady}
							onDocChange={onDocChange}
						/>
					</Stack>
					<Stack grow="fill">
						<Heading size="medium">Editor Fallback Only</Heading>
						<EditorWithNodeViewFallbacked
							adf={liveAdf}
							appearance={appearance}
							onReady={onMockedReady}
						/>
					</Stack>
				</Flex>
			</div>
		);
	},
);

export default function MediaSingleLazyNodeViewComparisonAlignment() {
	return <LazyNodeViewComparison name="LazyNode: Example" appearance="full-page" />;
}
