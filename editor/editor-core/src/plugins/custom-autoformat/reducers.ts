import {
  CustomAutoformatState,
  CustomAutoformatAction,
  CustomAutoformatMatched,
  CustomAutoformatResolved,
  CustomAutoformatFinish,
} from './types';

type Reducer<ActionType> = (
  state: CustomAutoformatState,
  action: ActionType,
) => CustomAutoformatState;

// queues a match at a given position in the document
const matched: Reducer<CustomAutoformatMatched> = (state, action) => ({
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
const resolved: Reducer<CustomAutoformatResolved> = (state, action) => ({
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
const finish: Reducer<CustomAutoformatFinish> = (state, action) => {
  return {
    ...state,
    resolving: state.resolving.filter(
      (resolving) => resolving.match[0] !== action.matchString,
    ),
    matches: state.matches.filter(
      (matching) => matching.matchString !== action.matchString,
    ),
  };
};

const reduce: Reducer<CustomAutoformatAction> = (state, action) => {
  switch (action.action) {
    case 'matched':
      return matched(state, action);
    case 'resolved':
      return resolved(state, action);
    case 'finish':
      return finish(state, action);
    default:
      return state;
  }
};

export default reduce;
