import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { FindReplacePluginState } from '../types';

import type { FindReplaceAction } from './actions';
import { FindReplaceActionTypes } from './actions';

const reducer =
	(getInitialState: () => FindReplacePluginState) =>
	(state: FindReplacePluginState, action: FindReplaceAction): FindReplacePluginState => {
		switch (action.type) {
			case FindReplaceActionTypes.ACTIVATE:
			case FindReplaceActionTypes.FIND:
				return {
					...state,
					isActive: true,
					shouldFocus: action.type === FindReplaceActionTypes.ACTIVATE,
					findText: action.findText !== undefined ? action.findText : state.findText,
					matches: action.matches || state.matches,
					index: action.index !== undefined ? action.index : state.index,
				};

			case FindReplaceActionTypes.UPDATE_DECORATIONS:
				return {
					...state,
					decorationSet: action.decorationSet,
				};

			case FindReplaceActionTypes.FIND_NEXT:
				return {
					...state,
					index: action.index,
					decorationSet: action.decorationSet,
				};

			case FindReplaceActionTypes.FIND_PREVIOUS:
				return {
					...state,
					index: action.index,
					decorationSet: action.decorationSet,
				};

			case FindReplaceActionTypes.REPLACE:
			case FindReplaceActionTypes.REPLACE_ALL:
				return {
					...state,
					replaceText: action.replaceText,
					decorationSet: action.decorationSet,
					matches: action.matches,
					index: action.index,
				};

			case FindReplaceActionTypes.CANCEL:
				const { getIntl, api } = state;
				return expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
					? { ...getInitialState(), getIntl, api }
					: getInitialState();

			case FindReplaceActionTypes.BLUR:
				return {
					...state,
					shouldFocus: false,
				};

			case FindReplaceActionTypes.TOGGLE_MATCH_CASE:
				return {
					...state,
					shouldMatchCase: !state.shouldMatchCase,
				};

			default:
				return state;
		}
	};

export default reducer;
