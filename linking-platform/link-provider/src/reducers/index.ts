import { type JsonLd } from 'json-ld-types';

import {
	ACTION_PENDING,
	ACTION_RESOLVING,
	ACTION_RESOLVED,
	ACTION_ERROR,
	ACTION_ERROR_FALLBACK,
	ACTION_UPDATE_METADATA_STATUS,
	type CardStore,
	type CardState,
	type CardActionType,
	ACTION_RELOADING,
	type CardAction,
	getStatus,
} from '@atlaskit/linking-common';
import { type CardReducer } from '../types';
import { type AnyAction } from 'redux';

const isCardAction = (action: AnyAction): action is CardAction => {
	return [
		ACTION_PENDING,
		ACTION_RESOLVING,
		ACTION_RESOLVED,
		ACTION_RELOADING,
		ACTION_ERROR,
		ACTION_ERROR_FALLBACK,
		ACTION_UPDATE_METADATA_STATUS,
	].includes(action.type);
};

function persistPayloadToState(
	payload: JsonLd.Response<JsonLd.Data.BaseData> | undefined,
	state: CardState,
	type: Exclude<CardActionType, 'reloading' | 'metadata'>,
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
		case ACTION_UPDATE_METADATA_STATUS: {
			return { ...state, metadataStatus: action.metadataStatus };
		}
	}
}

export const cardReducer: CardReducer<CardStore, JsonLd.Response> = (state, action) => {
	if (!isCardAction(action)) {
		return state;
	}
	const cardState = state[action.url];

	// Card may have reached the same state on account of multiple of the same
	// URL being present in an editor session. E.g. page with N links to one resource.
	const hasSameStatus = !action.ignoreStatusCheck && cardState && cardState.status === action.type;

	if (hasSameStatus) {
		return state;
	} else {
		const nextState = reduceToNextState(cardState, action);
		return { ...state, [action.url]: nextState };
	}
};
