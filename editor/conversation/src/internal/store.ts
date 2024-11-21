import { createStore as createReduxStore, type Store, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducers } from './reducers';

import { type Conversation } from '../model/Conversation';
import { type User } from '../model/User';

export interface State {
	conversations: Conversation[];
	user?: User;
	highlighted?: string;
}

export interface Action {
	type: string;
	payload?: any;
}

export type Handler = (state: State | undefined) => void;

export default function createStore(initialState?: State): Store<State | undefined> {
	return createReduxStore(reducers, initialState, applyMiddleware(thunk));
}
