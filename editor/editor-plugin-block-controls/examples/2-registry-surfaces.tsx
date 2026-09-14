import React, { useMemo } from 'react';

import applyDevTools from 'prosemirror-dev-tools';
import { IntlProvider } from 'react-intl';

import {
	getExamplesProviders,
	useConfluenceFullPagePreset,
} from '@af/editor-examples-helpers/example-presets';
import IconButton from '@atlaskit/button/icon/button';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import {
	BLOCK_CONTROLS_LEFT_GROUP,
	BLOCK_CONTROLS_RIGHT_GROUP,
} from '@atlaskit/editor-common/block-controls/surface-keys';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { RegisterButton } from '@atlaskit/editor-ui-control-model/types';
import CommentIcon from '@atlaskit/icon/core/comment';
import DataNumberIcon from '@atlaskit/icon/core/data-number';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

import { defaultValue } from './default-value';

// Only render at the doc-level root target, same predicate the real quick-insert contributor
// uses. This keeps the button next to "+" at the top-level block even while a nested descendant
// (e.g. inside a layout column or blockquote) is the one actually hovered.
const isHiddenUnlessRootNode: RegisterButton['isHidden'] = ({ surfaceContext } = {}) => {
	const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
	return (
		!context?.activeNode ||
		context.targetNode.pos !== context.rootNode.pos ||
		context.targetNode.pos !== context.activeNode.rootPos
	);
};

const exampleLeftButton: RegisterButton = {
	component: () => (
		<IconButton
			shape="circle"
			appearance="subtle"
			icon={() => <StarStarredIcon label="" size="small" />}
			label="Example left control"
			onClick={() => console.log('Example left control clicked')}
			spacing="compact"
		/>
	),
	isHidden: isHiddenUnlessRootNode,
	key: 'example-left-button',
	parents: [{ ...BLOCK_CONTROLS_LEFT_GROUP, rank: 300 }],
	type: 'button',
};

const exampleRightButton: RegisterButton = {
	component: () => (
		<IconButton
			shape="circle"
			appearance="subtle"
			icon={() => <CommentIcon label="" size="small" />}
			label="Example right control"
			onClick={() => console.log('Example right control clicked')}
			spacing="compact"
		/>
	),
	isHidden: isHiddenUnlessRootNode,
	key: 'example-right-button',
	parents: [{ ...BLOCK_CONTROLS_RIGHT_GROUP, rank: 100 }],
	type: 'button',
};

const MIN_TEXT_LENGTH_FOR_LONG_TEXT_BUTTON = 10;

const exampleRightLongTextButton: RegisterButton = {
	component: () => (
		<IconButton
			shape="circle"
			appearance="subtle"
			icon={() => <DataNumberIcon label="" size="small" />}
			label="Example long-text control"
			onClick={() => console.log('Example long-text control clicked')}
			spacing="compact"
		/>
	),
	isHidden: ({ surfaceContext } = {}) => {
		const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
		return (
			!context ||
			context.targetNode.node.textContent.length < MIN_TEXT_LENGTH_FOR_LONG_TEXT_BUTTON ||
			context.targetNode.parentType !== 'doc'
		);
	},
	key: 'example-right-long-text-button',
	parents: [{ ...BLOCK_CONTROLS_RIGHT_GROUP, rank: 1 }],
	type: 'button',
};

/**
 * Contributes the example controls the way a real feature does: from a plugin, during preset
 * construction.
 *
 * The timing matters, and not only for tidiness. The block controls plugin resolves the registered
 * surfaces once, when its ProseMirror plugin is created, and uses that to decide which nodes get a
 * surface without being hovered. Registering after the editor exists — from an effect, say — misses
 * that snapshot, so a persistent control such as `exampleRightLongTextButton` would render only on
 * the hovered node, which is exactly what it is meant not to do. A plugin factory runs while the
 * preset is being built, comfortably before then.
 */
const exampleSurfaceControlsPlugin: NextEditorPlugin<
	'exampleSurfaceControls',
	{ dependencies: [OptionalPlugin<UiControlRegistryPlugin>] }
> = ({ api }) => {
	api?.uiControlRegistry?.actions.register([
		exampleLeftButton,
		exampleRightButton,
		exampleRightLongTextButton,
	]);

	return { name: 'exampleSurfaceControls' };
};

function Editor(): React.JSX.Element {
	const providers = useMemo(() => getExamplesProviders({ sanitizePrivateContent: true }), []);
	const mockedCollabEditProvider = useMemo(
		() =>
			createCollabEditProvider({
				userId: 'user-1',
				defaultDoc: JSON.stringify(defaultValue),
			}),
		[],
	);

	const { preset } = useConfluenceFullPagePreset({
		editorAppearance: 'full-page',
		overridedFullPagePresetProps: {
			providers,
			enabledOptionalPlugins: {
				uiControlRegistry: true,
			},
		},
	});

	const presetWithExampleControls = useMemo(
		() => preset.add(exampleSurfaceControlsPlugin),
		[preset],
	);

	return (
		<IntlProvider locale="en">
			<ComposableEditor
				appearance="full-page"
				collabEdit={{ provider: mockedCollabEditProvider }}
				defaultValue={defaultValue}
				onChange={(view) => {
					applyDevTools(view);
				}}
				preset={presetWithExampleControls}
			/>
		</IntlProvider>
	);
}

export default Editor;
