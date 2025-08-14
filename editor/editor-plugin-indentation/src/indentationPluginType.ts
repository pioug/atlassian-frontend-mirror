import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { Node } from '@atlaskit/editor-prosemirror/model';

import type { IndentationInputMethod } from './editor-commands/utils';

type IndentationPluginSharedState = {
	isIndentationAllowed: boolean;
	indentDisabled: boolean;
	outdentDisabled: boolean;
};

export type IndentationPluginDependencies = [OptionalPlugin<AnalyticsPlugin>];

export type IndentationPluginActions = {
	indentParagraphOrHeading: (inputMethod: IndentationInputMethod) => Command;
	outdentParagraphOrHeading: (inputMethod: IndentationInputMethod) => Command;
};

export type IndentationPlugin = NextEditorPlugin<
	'indentation',
	{
		dependencies: IndentationPluginDependencies;
		actions: IndentationPluginActions;
		sharedState: IndentationPluginSharedState | undefined;
	}
>;

export interface GetAttrsChange<T, V> {
	node: Node;
	prevAttrs?: T;
	newAttrs: T | false | undefined;
	options: V;
}

export type GetAttrsWithChangesRecorder<T, V> = {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getAttrs(prevAttrs?: T | undefined, node?: Node): T | false | undefined;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getAndResetAttrsChanges(): GetAttrsChange<T, V>[];
};
