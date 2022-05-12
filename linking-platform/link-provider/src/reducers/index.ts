import { JsonLd } from 'json-ld-types';

import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_RESOLVED,
  ACTION_ERROR,
  ACTION_ERROR_FALLBACK,
  CardStore,
  CardState,
} from '@atlaskit/linking-common';
import { CardReducerMap, CardReducer } from '../types';
import { getStatus } from '../helpers';

const cardReducerMap: CardReducerMap<CardState, JsonLd.Response> = {
  [ACTION_PENDING]: (_state, { type }) => {
    return { status: type };
  },
  [ACTION_RESOLVING]: (state, { type }) => {
    return { ...state, status: type };
  },
  [ACTION_RESOLVED]: (state, { type, payload }) => {
    const nextDetails = payload;
    const nextState = { ...state };
    if (nextDetails) {
      nextState.status = getStatus(nextDetails);
      nextState.details = nextDetails;
    } else {
      // Keep the pre-existing data in the store. If there
      // is no data, the UI should handle this gracefully.
      nextState.status = type;
    }
    return nextState;
  },
  [ACTION_ERROR]: (state, { type, error }) => {
    return { ...state, status: type, error };
  },
  [ACTION_ERROR_FALLBACK]: (state, { type, error }) => {
    return { ...state, status: type, error };
  },
};

export const cardReducer: CardReducer<CardStore, JsonLd.Response> = (
  state,
  action,
) => {
  if (cardReducerMap[action.type]) {
    const cardState = state[action.url];
    // Card may have reached the same state on account of multiple of the same
    // URL being present in an editor session. E.g. page with N links to one resource.
    const hasSameStatus = cardState && cardState.status === action.type;
    if (hasSameStatus) {
      return state;
    } else {
      const nextState = cardReducerMap[action.type](cardState, action);
      return { ...state, [action.url]: nextState };
    }
  }
  return state;
};
