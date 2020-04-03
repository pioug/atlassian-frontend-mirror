import {
  CardPluginState,
  CardPluginAction,
  SetProvider,
  Queue,
  Resolve,
  Request,
  Register,
  ShowLinkToolbar,
  HideLinkToolbar,
} from '../types';

const queue = (state: CardPluginState, action: Queue) => {
  return {
    ...state,
    requests: state.requests.concat(action.requests),
  };
};

const resolve = (state: CardPluginState, action: Resolve) => {
  const requests = state.requests.reduce((requests, request) => {
    if (request.url !== action.url) {
      requests.push(request);
    }

    return requests;
  }, [] as Request[]);

  return {
    ...state,
    requests,
  };
};

const register = (state: CardPluginState, action: Register) => {
  return {
    ...state,
    cards: [...state.cards, action.info],
  };
};

const setProvider = (state: CardPluginState, action: SetProvider) => {
  return { ...state, provider: action.provider };
};

const setLinkToolbar = (
  state: CardPluginState,
  action: ShowLinkToolbar | HideLinkToolbar,
) => {
  return {
    ...state,
    showLinkingToolbar: action.type === 'SHOW_LINK_TOOLBAR',
  };
};

export default (
  state: CardPluginState,
  action: CardPluginAction,
): CardPluginState => {
  switch (action.type) {
    case 'QUEUE':
      return queue(state, action);
    case 'SET_PROVIDER':
      return setProvider(state, action);
    case 'RESOLVE':
      return resolve(state, action);
    case 'REGISTER':
      return register(state, action);
    case 'SHOW_LINK_TOOLBAR':
    case 'HIDE_LINK_TOOLBAR':
      return setLinkToolbar(state, action);
  }
};
