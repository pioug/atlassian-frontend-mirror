/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ComposableEditor } from './composable-editor';
import type { InitialPluginConfiguration } from './preset-universal';
import useUniversalPreset from './presets/useUniversalPreset';
import type { EditorProps } from './types/editor-props';
import editorDeprecationWarnings from './utils/editorDeprecationWarnings';

export type {
	AllowedBlockTypes,
	Command,
	CommandDispatch,
	DomAtPos,
	EditorAppearance,
	EditorAppearanceComponentProps,
	EditorConfig,
	EditorInstance,
	EditorPlugin,
	EditorProps,
	ExtensionConfig,
	ExtensionProvidersProp,
	MarkConfig,
	MessageDescriptor,
	NodeConfig,
	NodeViewConfig,
	PluginsOptions,
	PMPlugin,
	PMPluginCreateConfig,
	PMPluginFactory,
	PMPluginFactoryParams,
	ReactComponents,
	ToolbarUIComponentFactory,
	ToolbarUiComponentFactoryParams,
	UIComponentFactory,
	UiComponentFactoryParams,
} from './types';
export type { FeedbackInfo } from '@atlaskit/editor-common/types';

interface WrapperProps {
	props: EditorProps;
	initialPluginConfiguration?: InitialPluginConfiguration;
}

const ComposableEditorWrapper = ({ props, initialPluginConfiguration }: WrapperProps) => {
	const preset = useUniversalPreset({ props, initialPluginConfiguration });
	return <ComposableEditor preset={preset} {...props} />;
};

interface EditorPropsWithInitialPluginConfiguration extends EditorProps {
	initialPluginConfiguration?: InitialPluginConfiguration;
}

/**
 * @deprecated - Please use the `ComposableEditor` component instead.
 * We strongly encourage the use of custom presets, however your easiest migration path is to use the `useUniversalPreset` hook.
 * The `ComposableEditor` component is a more flexible and customizable alternative to the `Editor` component.
 * It allows you to create an editor with a custom set of plugins and configurations.
 * For more information, see the documentation for the `ComposableEditor` component here: https://atlaskit.atlassian.com/packages/editor/editor-core
 */
export default class Editor extends React.Component<EditorPropsWithInitialPluginConfiguration> {
	static defaultProps: EditorProps = {
		appearance: 'comment',
		disabled: false,
		extensionHandlers: {},
		allowHelpDialog: true,
		quickInsert: true,
	};

	constructor(props: EditorPropsWithInitialPluginConfiguration) {
		super(props);
		editorDeprecationWarnings(props);
	}

	render() {
		return (
			<ComposableEditorWrapper
				props={this.props}
				initialPluginConfiguration={this.props.initialPluginConfiguration}
			/>
		);
	}
}
