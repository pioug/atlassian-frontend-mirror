import React, { useRef } from 'react';

import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type {
	ExtensionConfiguration,
	ToolbarExtensionConfiguration,
	SelectionExtensionPlugin,
} from '@atlaskit/editor-plugin-selection-extension';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import AddIcon from '@atlaskit/icon/core/add';
import NoteIcon from '@atlaskit/icon/core/note';

export const useNoteSelectionExtension = (
	editorApi: PublicPluginAPI<
		[ToolbarPlugin, EditorViewModePlugin, SelectionExtensionPlugin]
	> | null,
) => {
	const editorApiRef = useRef(editorApi);
	editorApiRef.current = editorApi;

	const toolbarConfiguration: ToolbarExtensionConfiguration = {
		getToolbarItem: () => ({
			icon: NoteIcon,
			tooltip: 'Create a note',
			// eslint-disable-next-line no-alert
			onClick: () => alert('Create note clicked123'),
		}),
		getMenuItems: () => {
			return [
				{
					label: 'Lorem ipsum',
					icon: NoteIcon,
					// eslint-disable-next-line no-alert
					onClick: () => alert('Lorem ipsum clicked'),
				},
				{
					label: 'Consectetur adipiscing elit',
					icon: NoteIcon,
					// eslint-disable-next-line no-alert
					onClick: () => alert('Consectetur adipiscing elit clicked'),
				},
				{
					label: 'Sed do eiusmod',
					icon: NoteIcon,
					// eslint-disable-next-line no-alert
					onClick: () => alert('Sed do eiusmod clicked'),
				},
				{
					label: 'Create a note',
					icon: AddIcon,
					// eslint-disable-next-line no-alert
					onClick: () => alert('Create note clicked'),
				},
			];
		},
	};

	const noteSelectionExtension: ExtensionConfiguration = {
		key: 'note-selection-extension',
		source: 'first-party',
		primaryToolbar: toolbarConfiguration,
		inlineToolbar: toolbarConfiguration,
	};

	const toolbarItemOnlyExtension: ExtensionConfiguration = {
		key: 'toolbar-item-only-extension',
		source: 'first-party',
		inlineToolbar: {
			getToolbarItem: () => {
				return {
					icon: NoteIcon,
					tooltip: 'Toolbar item only',
					onClick: () => {
						// eslint-disable-next-line no-alert
						alert('Toolbar item only clicked');
					},
				};
			},
		},
		primaryToolbar: {
			getToolbarItem: () => ({
				icon: NoteIcon,
				tooltip: 'Toolbar item only',
				// eslint-disable-next-line no-alert
				onClick: () => alert('Toolbar item only clicked'),
			}),
		},
	};

	const mockFirstPartyExtension: ExtensionConfiguration = {
		key: 'mock-first-party-extension',
		source: 'first-party',
		inlineToolbar: {
			getMenuItems: () => [
				{
					label: 'First party item with onClick',
					icon: NoteIcon,
					// eslint-disable-next-line no-alert
					onClick: () => alert('First party item with onClick clicked'),
				},
				{
					label: 'First party item with contentComponent',
					icon: NoteIcon,
					contentComponent: () => <div>First party item with contentComponent</div>,
				},
			],
		},
	};

	const mockExternalExtension: ExtensionConfiguration = {
		key: 'mock-external-extension',
		source: 'external',
		inlineToolbar: {
			getMenuItems: () => {
				return [
					{
						label: 'Mock External Item with onClick',
						icon: NoteIcon,
						// eslint-disable-next-line no-alert
						onClick: () => alert('Mock External Item with onClick clicked'),
					},
					{
						label: 'Mock External Item with contentComponent',
						icon: NoteIcon,
						contentComponent: () => <div>Mock External Item with contentComponent</div>,
					},
				];
			},
		},
	};

	return {
		extensionList: [
			noteSelectionExtension,
			toolbarItemOnlyExtension,
			mockFirstPartyExtension,
			mockExternalExtension,
		],
	};
};
