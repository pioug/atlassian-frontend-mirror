import { JsonLd } from 'json-ld-types';
import clone from 'lodash.clonedeep';

import * as actions from '../actions/constants';
import { CardReducerMap, CardReducer } from './types';
import { CardStore, CardState } from '../types';
import { getStatus } from '../helpers';

const cardReducerMap: CardReducerMap<CardState, JsonLd.Response> = {
  [actions.ACTION_PENDING]: (_state, { type }) => {
    return { status: type, lastUpdatedAt: Date.now() };
  },
  [actions.ACTION_RESOLVING]: (state, { type }) => {
    return { ...state, status: type };
  },
  [actions.ACTION_RESOLVED]: (state, { type, payload }) => {
    const nextDetails = payload;
    const nextState = clone(state);
    if (nextDetails) {
      nextState.status = getStatus(nextDetails);
      nextState.details = nextDetails;
    } else {
      // Keep the pre-existing data in the store. If there
      // is no data, the UI should handle this gracefully.
      nextState.status = type;
    }
    nextState.lastUpdatedAt = Date.now();
    return nextState;
  },
  [actions.ACTION_ERROR]: (state, { type, error }) => {
    return { ...state, status: type, error };
  },
  [actions.ACTION_ERROR_FALLBACK]: (state, { type, error }) => {
    return { ...state, status: type, error };
  },
};

export const cardReducer: CardReducer<CardStore, JsonLd.Response> = (
  state,
  action,
) => {
  if (cardReducerMap[action.type]) {
    const cardState = state[action.url];
    const nextState = cardReducerMap[action.type](cardState, action);
    return { ...state, [action.url]: nextState };
  }
  return state;
};
