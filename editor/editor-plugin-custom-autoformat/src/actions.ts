import type {
	CustomAutoformatFinish,
	CustomAutoformatMatched,
	CustomAutoformatResolved,
	CustomAutoformatSetProvider,
	Reducer,
} from './types';

// queues a match at a given position in the document
export const matched: Reducer<CustomAutoformatMatched> = (state, action) => ({
	...state,
	resolving: [
		...state.resolving,
		{
			start: action.start,
			end: action.end,
			match: action.match,
		},
	],
});

// store the replacement for a match
export const resolved: Reducer<CustomAutoformatResolved> = (state, action) => ({
	...state,
	matches: [
		...state.matches,
		{
			replacement: action.replacement,
			matchString: action.matchString,
		},
	],
});

// indicates a replacement in the document has been completed, and removes the match from both resolving and matches
export const finish: Reducer<CustomAutoformatFinish> = (state, action) => {
	return {
		...state,
		resolving: state.resolving.filter((resolving) => resolving.match[0] !== action.matchString),
		matches: state.matches.filter((matching) => matching.matchString !== action.matchString),
	};
};

// sets the autoformatting provider in the shared plugin state
export const setProvider: Reducer<CustomAutoformatSetProvider> = (state, action) => {
	return {
		...state,
		autoformattingProvider: action.provider,
	};
};
