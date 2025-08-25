// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

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
	Command,
	CommandDispatch,
	DomAtPos,
	EditorAppearanceComponentProps,
	EditorConfig,
	EditorInstance,
	EditorProps,
	ExtensionConfig,
	ExtensionProvidersProp,
	MessageDescriptor,
	PMPluginCreateConfig,
} from './types';

interface WrapperProps {
	initialPluginConfiguration?: InitialPluginConfiguration;
	props: EditorProps;
}

const ComposableEditorWrapper = ({ props, initialPluginConfiguration }: WrapperProps) => {
	const preset = useUniversalPreset({ props, initialPluginConfiguration });
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <ComposableEditor preset={preset} {...props} />;
};

interface EditorPropsWithInitialPluginConfiguration extends EditorProps {
	initialPluginConfiguration?: InitialPluginConfiguration;
}

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated - Please use the `ComposableEditor` component instead.
 * We strongly encourage the use of custom presets, however your easiest migration path is to use the `useUniversalPreset` hook.
 * The `ComposableEditor` component is a more flexible and customizable alternative to the `Editor` component.
 * It allows you to create an editor with a custom set of plugins and configurations.
 * For more information, see the documentation for the `ComposableEditor` component here: https://atlaskit.atlassian.com/packages/editor/editor-core
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
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
