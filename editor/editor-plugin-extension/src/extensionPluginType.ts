import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
	ExtensionAPI,
	ExtensionHandlers,
	ExtensionProvider,
	Parameters,
	TransformAfter,
	TransformBefore,
	UpdateExtension,
} from '@atlaskit/editor-common/extensions';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { ApplyChangeHandler, ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { Fragment, Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { forceAutoSave } from './editor-commands/commands';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RejectSave = (reason?: any) => void;

export type ExtensionState<T extends Parameters = Parameters> = {
	localId?: string;
	autoSaveResolve?: () => void;
	autoSaveReject?: RejectSave;
	showEditButton: boolean;
	showContextPanel: boolean;
	updateExtension?: Promise<UpdateExtension<T> | void>;
	element?: HTMLElement;
	extensionProvider?: ExtensionProvider<T>;
	processParametersBefore?: TransformBefore<T>;
	processParametersAfter?: TransformAfter<T>;
	positions?: Record<number, number>;
};

export type ExtensionAction<T extends Parameters = Parameters> = {
	type: 'UPDATE_STATE';
	data: Partial<ExtensionState<T>>;
};

interface CreateExtensionAPIOptions {
	editorView: EditorView;
	applyChange: ApplyChangeHandler | undefined;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editInLegacyMacroBrowser?: () => void;
}

export type CreateExtensionAPI = (options: CreateExtensionAPIOptions) => ExtensionAPI;

export interface ExtensionPluginOptions extends LongPressSelectionPluginOptions {
	breakoutEnabled?: boolean;
	extensionHandlers?: ExtensionHandlers;
	appearance?: EditorAppearance;
	allowDragAndDrop?: boolean;
	__rendererExtensionOptions?: {
		rendererExtensionHandlers?: ExtensionHandlers;
		isAllowedToUseRendererView: (node: ADFEntity) => boolean;
	};
}

type InsertMacroFromMacroBrowser = (
	macroProvider: MacroProvider,
	macroNode?: PmNode,
	isEditing?: boolean,
) => (view: EditorView) => Promise<boolean>;

export type RunMacroAutoConvert = (state: EditorState, text: string) => PmNode | null;

export type InsertOrReplaceExtensionType = {
	editorView: EditorView;
	action: 'insert' | 'replace';
	attrs: object;
	content: Fragment;
	position: number;
	size: number;
	tr: Transaction;
};

type InsertOrReplaceExtensionAction = ({
	editorView,
	action,
	attrs,
	content,
	position,
	size,
	tr,
}: InsertOrReplaceExtensionType) => Transaction;

export type ExtensionPlugin = NextEditorPlugin<
	'extension',
	{
		pluginConfiguration: ExtensionPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
			WidthPlugin,
			DecorationsPlugin,
			OptionalPlugin<ContextPanelPlugin>,
			OptionalPlugin<ContextIdentifierPlugin>,
		];
		sharedState:
			| {
					showContextPanel: boolean | undefined;
			  }
			| undefined;
		actions: {
			editSelectedExtension: () => boolean;
			api: () => ExtensionAPI;
			insertMacroFromMacroBrowser: InsertMacroFromMacroBrowser;
			insertOrReplaceExtension: InsertOrReplaceExtensionAction;
			insertOrReplaceBodiedExtension: InsertOrReplaceExtensionAction;
			runMacroAutoConvert: RunMacroAutoConvert;
			forceAutoSave: typeof forceAutoSave;
		};
	}
>;
