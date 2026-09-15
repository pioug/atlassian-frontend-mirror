import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { GetPMNodeHeight } from '@atlaskit/editor-common/extensibility';
import type {
	ExtensionAPI,
	ExtensionHandlers,
	ExtensionParams,
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
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { ApplyChangeHandler, ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { CopyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
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
	showCopyButton: boolean;
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
	/**
	 * Animates native embed nodes in: held closed while the embed loads, then opened out with the
	 * embed fading in. For surfaces where extensions arrive after the surrounding content, such as
	 * AI-generated MAUI apps in the Create with Rovo preview. Only native embed nodes animate; the
	 * reveal waits on the embed's own loading state, and other extension types are unaffected.
	 */
	allowAIGeneratedContentMotion?: boolean;
	appearance?: EditorAppearance;
	breakoutEnabled?: boolean;
	/**
	 * Whether the extension floating toolbar offers a copy button. Defaults to
	 * `true`. Set `false` for content whose structure the product fixes, so the
	 * toolbar does not offer an action the document will refuse.
	 *
	 * Gated on `platform_editor_extension_hide_toolbar_actions`: until that gate
	 * is on, setting this has no effect.
	 *
	 * For hiding copy on a single extension type instead, use the manifest node's
	 * `hideCopyButton`, which is not gated on the above.
	 */
	copyEnabled?: boolean;
	/**
	 * Whether the extension floating toolbar offers a delete button. Defaults to
	 * `true`, and gated on `platform_editor_extension_hide_toolbar_actions` the
	 * same way `copyEnabled` is.
	 */
	deleteEnabled?: boolean;
	extensionHandlers?: ExtensionHandlers;
	/**
	 * Helps optimize layout shift while rendering by setting minimum heights before the extension content loads.
	 */
	getExtensionHeight?: GetPMNodeHeight;
	/**
	 * Returns the ADF content of the unsupported content extension.
	 * Which will be copied to the clipboard when the copy button is clicked.
	 */
	getUnsupportedContent?: (node: ExtensionParams<Parameters>) => JSONDocNode | undefined;
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
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<MentionsPlugin>,
	OptionalPlugin<CopyButtonPlugin>,
	OptionalPlugin<BlockMenuPlugin>,
];

export type RegisterExtensionLoadingHandler = (options: {
	extensionType: string;
	handler: NonNullable<ExtensionHandlers[string]>;
}) => () => void;

export type ExtensionPluginActions = {
	api: () => ExtensionAPI;
	editSelectedExtension: () => boolean;
	forceAutoSave: typeof forceAutoSave;
	getExtensionLoadingHandlers: () => ExtensionHandlers;
	insertMacroFromMacroBrowser: InsertMacroFromMacroBrowser;
	insertOrReplaceBodiedExtension: InsertOrReplaceExtensionAction;
	insertOrReplaceExtension: InsertOrReplaceExtensionAction;
	registerExtensionLoadingHandler: RegisterExtensionLoadingHandler;
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
