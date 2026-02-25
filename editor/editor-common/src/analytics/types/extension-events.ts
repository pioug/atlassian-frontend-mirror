import type { ExtensionLayout } from '@atlaskit/adf-schema';

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { SELECTION_TYPE, OperationalAEP, TrackAEP, UIAEP } from './utils';

export enum GAP_CURSOR_POSITION {
	LEFT = 'left',
	RIGHT = 'right',
}

export enum TARGET_SELECTION_SOURCE {
	CURRENT_SELECTION = 'currentSelection',
	HTML_ELEMENT = 'htmlElement',
}

// Not a discriminated union because we are using `selection.toJSON()`
export type SelectionJson = {
	anchor?: number;
	head?: number;
	pos?: number;
	side?: GAP_CURSOR_POSITION;
	type: SELECTION_TYPE;
};

export type ExtensionType =
	| ACTION_SUBJECT_ID.EXTENSION_BLOCK
	| ACTION_SUBJECT_ID.EXTENSION_BODIED
	| ACTION_SUBJECT_ID.EXTENSION_INLINE;

type ExtensionUpdateAEP = TrackAEP<
	ACTION.UPDATED | ACTION.ERRORED,
	ACTION_SUBJECT.EXTENSION,
	ExtensionType,
	{
		/**
		 * extensionkey follows this format:
		 * `${manifest.key}:${manifest.modules.nodes.name}`
		 * e.g: 'awesome:item', 'awesome:default', 'awesome:list'
		 */
		extensionKey: string;
		// com.atlassian.ecosystem - Forge
		extensionType: string;
		layout?: ExtensionLayout;
		// UUID
		localId?: string;
		selection: SelectionJson;
		// Updated using selection from
		targetSelectionSource: TARGET_SELECTION_SOURCE;
	},
	INPUT_METHOD.MACRO_BROWSER | INPUT_METHOD.CONFIG_PANEL | INPUT_METHOD.TOOLBAR
>;

type ExtensionDeletedAEP = TrackAEP<
	ACTION.DELETED,
	ACTION_SUBJECT.EXTENSION,
	ExtensionType,
	{
		extensionKey: string;
		extensionType: string;
		inputMethod?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB;
		localId: string;
	},
	INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB
>;

type ExtensionCopyFailedAEP = OperationalAEP<
	ACTION.COPY_FAILED,
	ACTION_SUBJECT.EXTENSION,
	ExtensionType,
	{
		errorMessage: string;
		errorStack?: string;
		extensionKey: string;
		extensionType: string;
	}
>;

type ExtensionAPICalledPayload = TrackAEP<
	ACTION.INVOKED,
	ACTION_SUBJECT.EXTENSION,
	ACTION_SUBJECT_ID.EXTENSION_API,
	{
		functionName: string;
	},
	INPUT_METHOD.EXTENSION_API
>;

type ExtensionCopyAEP = UIAEP<
	ACTION.CLICKED,
	ACTION_SUBJECT.COPY_BUTTON,
	ExtensionType,
	{
		extensionKey: string;
		extensionType: string;
	}
>;

export type ExtensionEventPayload =
	| ExtensionUpdateAEP
	| ExtensionDeletedAEP
	| ExtensionCopyFailedAEP
	| ExtensionCopyAEP
	| ExtensionAPICalledPayload;
