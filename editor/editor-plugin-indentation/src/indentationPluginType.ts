import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { Node } from '@atlaskit/editor-prosemirror/model';

import type { IndentationInputMethod } from './editor-commands/utils';

type IndentationPluginSharedState = {
	isIndentationAllowed: boolean;
	indentDisabled: boolean;
	outdentDisabled: boolean;
};

export type IndentationPlugin = NextEditorPlugin<
	'indentation',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		actions: {
			indentParagraphOrHeading: (inputMethod: IndentationInputMethod) => Command;
			outdentParagraphOrHeading: (inputMethod: IndentationInputMethod) => Command;
		};
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
	getAttrs(prevAttrs?: T | undefined, node?: Node): T | false | undefined;
	getAndResetAttrsChanges(): GetAttrsChange<T, V>[];
};
