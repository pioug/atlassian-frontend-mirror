import type { ComponentType, ReactNode } from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { BlockTransformExtension } from '../../block-menu/block-transform-extension';
import type { QuickInsertPreview } from '../../quick-insert/preview';
import type {
	ExtensionAPI,
	ExtensionParams,
	MultiBodiedExtensionActions,
	UpdateExtension,
} from './extension-handler';
import type { ExtensionIconModule, MaybeESModule } from './extension-manifest-common';
import type { ContextualToolbar } from './extension-manifest-toolbar-item';
import type { Parameters } from './extension-parameters';
import type { FieldDefinition, Option, UserFieldContext } from './field-definitions';

export type ExtensionType = string;
export type ExtensionKey = string;
export type ExtensionModuleKey = string;
export type ExtensionComponentProps<T extends Parameters = Parameters> = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any; // many renderers pass their own context through too
	actions?: MultiBodiedExtensionActions;
	node: ExtensionParams<T>;
};

export type ExtensionComponent<T extends Parameters> = ComponentType<
	React.PropsWithChildren<ExtensionComponentProps<T>>
>;
export type ExtensionComponentModule<T extends Parameters> = Promise<
	MaybeESModule<ExtensionComponent<T>>
>;

export type Serializer<T extends Parameters = Parameters> = (data: T) => string;
export type Deserializer<T extends Parameters = Parameters> = (value: string) => T;

export type ExtensionModuleActionObject<T extends Parameters = Parameters> = {
	key: ExtensionModuleKey;
	parameters?: T;
	type: 'node';
};

export type MaybeADFEntity = MaybeESModule<ADFEntity | Array<ADFEntity> | void>;
export type ExtensionModuleActionHandler = (extensionAPI: ExtensionAPI) => Promise<MaybeADFEntity>;

export type ExtensionModuleAction<T extends Parameters = Parameters> =
	| ExtensionModuleActionObject<T>
	| ExtensionModuleActionHandler;

/** Identifies the app contributing an extension manifest or module. */
export type ExtensionApp = {
	/** Stable, non-localized key shared by every extension contributed by the app. */
	key: string;
	/** Provenance of the extension contribution. Omit when provenance cannot be determined. */
	source?: 'internal' | 'ecosystem';
};

export type ExtensionModule<T extends Parameters = Parameters> = {
	action: ExtensionModuleAction<T>;
	app?: ExtensionApp;
	categories?: string[];
	/**
	 * The Quick Insert category for this module. Takes precedence over the
	 * legacy `categories` field while both are supported.
	 */
	category?: string;
	description?: string;
	featured?: boolean;
	icon?: () => ExtensionIconModule;
	key: string;
	keywords?: string[];
	lozenge?: ReactNode;
	parameters?: T;
	/** Module-specific preview, which takes precedence over the manifest preview. */
	preview?: QuickInsertPreview;
	priority?: number;
	title?: string;
};

export type DynamicFieldDefinitions<T> = (parameters: T) => FieldDefinition[];

export type ExtensionModuleNode<T extends Parameters = Parameters> = {
	blockTransform?: BlockTransformExtension;
	getFieldsDefinition?: (
		extensionParameters: T,
	) => Promise<FieldDefinition[] | DynamicFieldDefinitions<T>>;
	/**
	 * When true, the copy button is hidden from this node's selection toolbar.
	 * Use for nodes whose content should not be copied (e.g. redactions).
	 */
	hideCopyButton?: boolean;
	render: () => ExtensionComponentModule<T>;
	type: 'extension' | 'inlineExtension' | 'bodiedExtension' | 'multiBodiedExtension';
	update?: UpdateExtension<T>;
};

export type PreloadableExtensionModuleNode<T extends Parameters = Parameters> =
	ExtensionModuleNode<T> & {
		preloadRender: () => Promise<void>;
		// sync version of render. call after preloadRender()
		renderSync: () => MaybeESModule<ExtensionComponent<T>>;
	};

export type ExtensionModuleNodes<T extends Parameters = Parameters> = {
	[key: string]: ExtensionModuleNode<T>;
};

export type ExtensionAutoConvertHandler = (text: string) => ADFEntity | undefined;

export type ExtensionModuleAutoConvert = {
	url?: ExtensionAutoConvertHandler[];
};

export type CustomFieldResolver = (
	searchTerm?: string,
	defaultValue?: string | string[],
	parameters?: Parameters,
) => Promise<Option[]>;
export type UserFieldContextProvider = () => Promise<UserFieldContext>;

export type ExtensionModuleFieldTypeCustom = { resolver: CustomFieldResolver };
export type ExtensionModuleFieldTypeUser = {
	provider: UserFieldContextProvider;
};

export type ExtensionModuleFieldTypeFieldset<T extends Parameters = Parameters> = {
	deserializer?: Deserializer<T>;
	serializer?: Serializer<T>;
};

export type ExtensionModuleFields<T extends Parameters = Parameters> = {
	custom?: {
		[key: string]: ExtensionModuleFieldTypeCustom;
	};
	fieldset?: {
		[key: string]: ExtensionModuleFieldTypeFieldset<T>;
	};
	user?: {
		[key: string]: ExtensionModuleFieldTypeUser;
	};
};

export type ExtensionModules<T extends Parameters = Parameters> = {
	// define how/when to convert pasted content to this extension
	autoConvert?: ExtensionModuleAutoConvert;
	// define buttons in toolbars for certain node types
	contextualToolbars?: ContextualToolbar[];
	// define how to handle special fields used in config forms
	fields?: ExtensionModuleFields<T>;
	// define how to handle each type of node (update, render, config, etc)
	nodes?: ExtensionModuleNodes<T>;
	// define items to show up in the slash menu, element browser and plus menu
	quickInsert?: ExtensionModule<T>[];
};

export type ExtensionQuickInsertModule = 'quickInsert';
export type ExtensionModuleType<T extends Parameters = Parameters> = Exclude<
	keyof ExtensionModules<T>,
	'nodes' | 'fields'
>;

type AutoConvertMatches = {
	pattern: string;
};

export type ExtensionDeprecationStatus = {
	isDeprecated: boolean;
	message?: string | React.ReactNode;
};

export type ExtensionManifest<T extends Parameters = Parameters> = {
	app?: ExtensionApp;
	autoConvert?: { matchers: Array<AutoConvertMatches> };
	categories?: string[];
	/**
	 * The Quick Insert category for modules that do not provide one. Takes
	 * precedence over the legacy `categories` field while both are supported.
	 */
	category?: string;
	deprecation?: ExtensionDeprecationStatus;
	description?: string;
	documentationUrl?: string;
	icons: {
		[dimensions: string]: () => ExtensionIconModule;
		'48': () => ExtensionIconModule;
	};
	key: ExtensionKey;
	keywords?: string[];
	modules: ExtensionModules<T>;
	/** Default preview content for quick insert modules that do not override it. */
	preview?: QuickInsertPreview;
	summary?: string;
	title: string;
	type: ExtensionType;
};

// deprecated types
export type Icon = () => ExtensionIconModule;
export type Module<T extends Parameters> = MaybeESModule<T>;
