import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { GetPMNodeHeight } from '@atlaskit/editor-common/extensibility';
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
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
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
	autoSaveReject?: RejectSave;
	autoSaveResolve?: () => void;
	element?: HTMLElement;
	extensionProvider?: ExtensionProvider<T>;
	localId?: string;
	positions?: Record<number, number>;
	processParametersAfter?: TransformAfter<T>;
	processParametersBefore?: TransformBefore<T>;
	showContextPanel: boolean;
	showEditButton: boolean;
	updateExtension?: Promise<UpdateExtension<T> | void>;
};

export type ExtensionAction<T extends Parameters = Parameters> = {
	data: Partial<ExtensionState<T>>;
	type: 'UPDATE_STATE';
};

interface CreateExtensionAPIOptions {
	applyChange: ApplyChangeHandler | undefined;
	editInLegacyMacroBrowser?: () => void;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	editorView: EditorView;
}

export type CreateExtensionAPI = (options: CreateExtensionAPIOptions) => ExtensionAPI;

export interface ExtensionPluginOptions extends LongPressSelectionPluginOptions {
	__rendererExtensionOptions?: {
		isAllowedToUseRendererView: (node: ADFEntity) => boolean;
		rendererExtensionHandlers?: ExtensionHandlers;
		showUpdated1PBodiedExtensionUI: (node: ADFEntity) => boolean;
	};
	appearance?: EditorAppearance;
	breakoutEnabled?: boolean;
	extensionHandlers?: ExtensionHandlers;
	/**
	 * Helps optimize layout shift while rendering by setting minimum heights before the extension content loads.
	 */
	getExtensionHeight?: GetPMNodeHeight;
}

type InsertMacroFromMacroBrowser = (
	macroProvider: MacroProvider,
	macroNode?: PmNode,
	isEditing?: boolean,
) => (view: EditorView) => Promise<boolean>;

export type RunMacroAutoConvert = (state: EditorState, text: string) => PmNode | null;

export type InsertOrReplaceExtensionType = {
	action: 'insert' | 'replace';
	attrs: object;
	content: Fragment;
	editorView: EditorView;
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

export type ExtensionPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	WidthPlugin,
	DecorationsPlugin,
	OptionalPlugin<ContextPanelPlugin>,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
];

export type ExtensionPluginActions = {
	api: () => ExtensionAPI;
	editSelectedExtension: () => boolean;
	forceAutoSave: typeof forceAutoSave;
	insertMacroFromMacroBrowser: InsertMacroFromMacroBrowser;
	insertOrReplaceBodiedExtension: InsertOrReplaceExtensionAction;
	insertOrReplaceExtension: InsertOrReplaceExtensionAction;
	runMacroAutoConvert: RunMacroAutoConvert;
};

export type ExtensionPlugin = NextEditorPlugin<
	'extension',
	{
		actions: ExtensionPluginActions;
		dependencies: ExtensionPluginDependencies;
		pluginConfiguration: ExtensionPluginOptions | undefined;
		sharedState:
			| {
					extensionProvider?: ExtensionState['extensionProvider'];
					processParametersAfter?: ExtensionState['processParametersAfter'];
					showContextPanel: boolean | undefined;
			  }
			| undefined;
	}
>;
