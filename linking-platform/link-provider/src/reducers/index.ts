import { JsonLd } from 'json-ld-types';

import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_RESOLVED,
  ACTION_ERROR,
  ACTION_ERROR_FALLBACK,
  CardStore,
  CardState,
  CardActionType,
  ACTION_RELOADING,
  CardAction,
} from '@atlaskit/linking-common';
import { CardReducer } from '../types';
import { getStatus } from '../helpers';
import { AnyAction } from 'redux';

const isCardAction = (action: AnyAction): action is CardAction => {
  return [
    ACTION_PENDING,
    ACTION_RESOLVING,
    ACTION_RESOLVED,
    ACTION_RELOADING,
    ACTION_ERROR,
    ACTION_ERROR_FALLBACK,
  ].includes(action.type);
};

function persistPayloadToState(
  payload: JsonLd.Response<JsonLd.Data.BaseData> | undefined,
  state: CardState,
  type: Exclude<CardActionType, 'reloading'>,
) {
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
}

function reduceToNextState(state: CardState, action: CardAction) {
  switch (action.type) {
    case ACTION_PENDING: {
      return { status: action.type };
    }
    case ACTION_RESOLVING: {
      return { ...state, status: action.type };
    }
    case ACTION_RESOLVED: {
      return persistPayloadToState(action.payload, state, action.type);
    }
    case ACTION_RELOADING: {
      return persistPayloadToState(action.payload, state, 'resolved');
    }
    case ACTION_ERROR: {
      return { ...state, status: action.type, error: action.error };
    }
    case ACTION_ERROR_FALLBACK: {
      return {
        ...state,
        status: action.type,
        error: action.error,
        details: action.payload,
      };
    }
  }
}

export const cardReducer: CardReducer<CardStore, JsonLd.Response> = (
  state,
  action,
) => {
  if (!isCardAction(action)) {
    return state;
  }
  const cardState = state[action.url];

  // Card may have reached the same state on account of multiple of the same
  // URL being present in an editor session. E.g. page with N links to one resource.
  const hasSameStatus = cardState && cardState.status === action.type;
  if (hasSameStatus) {
    return state;
  } else {
    const nextState = reduceToNextState(cardState, action);
    return { ...state, [action.url]: nextState };
  }
};
