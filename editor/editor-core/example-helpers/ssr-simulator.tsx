import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash/debounce';

import {
	lazyNodeViewDecorationPluginKey,
	testOnlyIgnoreLazyNodeView,
} from '@atlaskit/editor-common/lazy-node-view';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
// eslint-disable-next-line @atlaskit/editor/warn-no-restricted-imports
import type { EditorActions, EditorProps } from '@atlaskit/editor-core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createUniversalPresetInternal } from '@atlaskit/editor-core/preset-universal';
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import Heading from '@atlaskit/heading';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Flex, Stack } from '@atlaskit/primitives/compiled';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import {
	type InitialPluginConfiguration,
	type UniversalPresetProps,
} from '../src/presets/universal';

type CreateExamplePresetConfig = {
	featureFlags?: EditorProps['featureFlags'];
	initialPluginConfiguration?: InitialPluginConfiguration;
	props?: UniversalPresetProps;
};

const createExamplePreset = (config: CreateExamplePresetConfig) => () => {
	return createUniversalPresetInternal({
		appearance: 'full-page',
		props: config.props ?? {},
		featureFlags: config.featureFlags ?? {},
		initialPluginConfiguration: config.initialPluginConfiguration ?? {},
	});
};

const EditorWithNodeViewFallback = memo(
	({
		adf,
		appearance,
		onReady,
		props,
		featureFlags,
		initialPluginConfiguration,
	}: {
		adf?: Object;
		appearance: EditorAppearance;
		featureFlags?: EditorProps['featureFlags'];
		initialPluginConfiguration?: InitialPluginConfiguration;
		onReady: () => void;
		props?: UniversalPresetProps;
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

		const { preset, editorApi } = usePreset(
			createExamplePreset({ props, featureFlags, initialPluginConfiguration }),
		);

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

const EditorWithRealNodeView = memo(
	({
		appearance,
		onReady,
		onDocChange,
		adf,
		props,
		featureFlags,
		initialPluginConfiguration,
	}: {
		adf: Object | undefined;
		appearance: EditorAppearance;
		featureFlags?: EditorProps['featureFlags'];
		initialPluginConfiguration?: InitialPluginConfiguration;
		onDocChange: (doc: PMNode) => void;
		onReady: () => void;
		props?: UniversalPresetProps;
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

		const { preset, editorApi } = usePreset(
			createExamplePreset({ props, featureFlags, initialPluginConfiguration }),
		);
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
				defaultValue={adf}
				featureFlags={featureFlags}
			/>
		);
	},
);

/*
 * This component simulates the SSR environment using the LNV fallback rendering
 * to show the APPROXIMATE HTML rendered through Tesseract.
 */
export const SSRSimulator = memo(
	({
		name,
		appearance,
		adf,
		props,
		featureFlags,
		experiments,
		initialPluginConfiguration,
	}: {
		adf: Object | undefined;
		appearance: EditorAppearance;
		experiments?: Record<string, boolean>;
		featureFlags?: EditorProps['featureFlags'];
		initialPluginConfiguration?: InitialPluginConfiguration;
		name: string;
		props?: UniversalPresetProps;
	}): React.JSX.Element => {
		const [mockedReady, setMockedReady] = useState(false);
		const [notMockedReady, setNotMockedReady] = useState(false);

		const onNotMockedReady = useCallback(() => {
			setNotMockedReady(true);
		}, []);

		const onMockedReady = useCallback(() => {
			setMockedReady(true);
		}, []);
		setBooleanFeatureFlagResolver((ffName) => {
			if (featureFlags && ffName in featureFlags) {
				return !!featureFlags[ffName];
			}
			return false;
		});
		if (experiments) {
			setupEditorExperiments('test', experiments);
		}
		const onDocChange = useMemo(
			() =>
				debounce((doc: PMNode) => {
					// ignore updates so first render is frozen
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
						<EditorWithRealNodeView
							appearance={appearance}
							onReady={onNotMockedReady}
							onDocChange={onDocChange}
							adf={adf}
							props={props}
							featureFlags={featureFlags}
							initialPluginConfiguration={initialPluginConfiguration}
						/>
					</Stack>
					<Stack grow="fill">
						<Heading size="medium">SSR Simulation</Heading>
						<EditorWithNodeViewFallback
							adf={adf}
							appearance={appearance}
							onReady={onMockedReady}
							props={props}
							featureFlags={featureFlags}
							initialPluginConfiguration={initialPluginConfiguration}
						/>
					</Stack>
				</Flex>
			</div>
		);
	},
);
