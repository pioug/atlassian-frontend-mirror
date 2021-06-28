import { EditorState, Transaction } from 'prosemirror-state';

import { CardPluginState, Request } from '../../types';
import { pluginKey } from '../plugin-key';

// ============================================================================ //
// ============================== PLUGIN STATE ================================ //
// ============================================================================ //
// Used for interactions with the Card Plugin's state.
// ============================================================================ //
export const getPluginState = (editorState: EditorState) =>
  pluginKey.getState(editorState) as CardPluginState | undefined;

export const getPluginStateWithUpdatedPos = (
  pluginState: CardPluginState,
  tr: Transaction,
) => ({
  ...pluginState,
  requests: pluginState.requests.map((request) => ({
    ...request,
    pos: tr.mapping.map(request.pos),
  })),
  cards: pluginState.cards.map((card) => ({
    ...card,
    pos: tr.mapping.map(card.pos),
  })),
});

export const getNewRequests = (
  oldState: CardPluginState | undefined,
  currentState: CardPluginState,
) => {
  if (oldState) {
    return currentState.requests.filter(
      (req) => !oldState.requests.find((oldReq) => isSameRequest(oldReq, req)),
    );
  }
  return currentState.requests;
};

const isSameRequest = (requestA: Request, requestB: Request) =>
  requestA.url === requestB.url && requestA.pos === requestB.pos;
