import { Action, State } from './store';

type Reducer = (state: State, action: Action) => State;

export const createReducer = (
  initialState: State,
  handlers: { [key: string]: Reducer },
) => (state: State = initialState, action: Action): State => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  }
  return state;
};
