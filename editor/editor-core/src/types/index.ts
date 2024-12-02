// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export type { EditorInstance } from './editor-instance';
export type { EditorConfig } from './editor-config';
export type {
	EditorProps,
	ReactComponents,
	ExtensionProvidersProp,
	PrimaryToolbarComponents,
	ContentComponents,
} from './editor-props';
export type { EditorAppearanceComponentProps } from './editor-appearance-component';
export type { Command, CommandDispatch } from './command';
export type { MessageDescriptor } from './i18n';
export type { DomAtPos } from './dom-at-pos';
export type { ExtensionConfig } from './extension-config';
export type { PMPluginCreateConfig } from './pm-plugin-list';
