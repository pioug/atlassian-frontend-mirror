import { type AutoformattingProvider } from '@atlaskit/editor-common/provider-factory';
import type { Node as ProsemirrorNode } from '@atlaskit/editor-prosemirror/model';

export type Reducer<ActionType> = (
	state: CustomAutoformatState,
	action: ActionType,
) => CustomAutoformatState;

export type CustomAutoformatPluginOptions = {
	autoformattingProvider: Promise<AutoformattingProvider> | undefined;
};

export type AutoformatCandidate = {
	start: number;
	end: number;
	match: string[];
};

export type AutoformatMatch = {
	matchString: string;
	replacement?: ProsemirrorNode;
};

export type CustomAutoformatPluginSharedState = {
	autoformattingProvider: AutoformattingProvider | undefined;
};

export type CustomAutoformatState = CustomAutoformatPluginSharedState & {
	resolving: Array<AutoformatCandidate>;
	matches: Array<AutoformatMatch>;
};

// actions

export type CustomAutoformatMatched = {
	action: 'matched';
	start: number;
	end: number;
	match: string[];
};

export type CustomAutoformatResolved = {
	action: 'resolved';
	matchString: string;
	replacement?: ProsemirrorNode;
};

export type CustomAutoformatFinish = {
	action: 'finish';
	matchString: string;
};

export type CustomAutoformatSetProvider = {
	action: 'setProvider';
	provider: AutoformattingProvider | undefined;
};

export type CustomAutoformatAction =
	| CustomAutoformatMatched
	| CustomAutoformatResolved
	| CustomAutoformatFinish
	| CustomAutoformatSetProvider;
