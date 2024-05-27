import { type Reducer, useReducer } from 'react';

import { type LinkSearchListItemData } from '../../common/types';

export interface PluginState {
  items: LinkSearchListItemData[] | null;
  error: unknown | null;
  isLoading: boolean;
}

export const ACTION_CLEAR = 'CLEAR';
export const ACTION_LOADING = 'LOADING';
export const ACTION_SUCCESS = 'SUCCESS';
export const ACTION_ERRORED = 'ERROR';

interface ClearAction {
  type: typeof ACTION_CLEAR;
}

interface ResolveLoadingAction {
  type: typeof ACTION_LOADING;
}

interface ResolveSuccessAction {
  type: typeof ACTION_SUCCESS;
  payload: Pick<PluginState, 'items' | 'isLoading'>;
}

interface ResolveErrorAction {
  type: typeof ACTION_ERRORED;
  payload: PluginState['error'];
}

export type ReducerAction =
  | ClearAction
  | ResolveLoadingAction
  | ResolveSuccessAction
  | ResolveErrorAction;

export const INITIAL_STATE: PluginState = {
  items: null,
  error: null,
  isLoading: false,
};

export function reducer(
  state: PluginState,
  action: ReducerAction,
): PluginState {
  switch (action.type) {
    case ACTION_CLEAR:
      return { ...INITIAL_STATE };
    case ACTION_LOADING:
      return { ...INITIAL_STATE, isLoading: true };
    case ACTION_SUCCESS:
      return {
        ...state,
        ...action.payload,
        error: null,
      };
    case ACTION_ERRORED:
      return { ...INITIAL_STATE, error: action.payload };
    default:
      return state;
  }
}

export const usePluginReducer = () =>
  useReducer<Reducer<PluginState, ReducerAction>>(reducer, INITIAL_STATE);
