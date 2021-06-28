import {
  CardProvider,
  CardAdf,
} from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';

import { OutstandingRequests, Request } from '../../types';
import { setProvider } from '../actions';
import { replaceQueuedUrlWithCard, handleFallbackWithAnalytics } from '../doc';

// ============================================================================ //
// ============================== PROVIDER UTILS ============================== //
// ============================================================================ //
// Used for all interactions with the EditorCardProvider.
// ============================================================================ //
export const resolveWithProvider = (
  view: EditorView,
  outstandingRequests: OutstandingRequests,
  provider: CardProvider,
  request: Request,
) => {
  const handleResolve = provider
    .resolve(request.url, request.appearance)
    .then((resolvedCard) => {
      delete outstandingRequests[request.url];
      return resolvedCard;
    })
    .then(handleResolved(view, request), handleRejected(view, request));
  outstandingRequests[request.url] = handleResolve;
  return handleResolve;
};

const handleResolved = (view: EditorView, request: Request) => (
  resolvedCard: CardAdf,
) => {
  replaceQueuedUrlWithCard(
    request.url,
    resolvedCard,
    request.analyticsAction,
  )(view.state, view.dispatch);
  return resolvedCard;
};
const handleRejected = (view: EditorView, request: Request) => () => {
  handleFallbackWithAnalytics(request.url, request.source)(
    view.state,
    view.dispatch,
  );
};

// listen for card provider changes
export const handleProvider = (
  _: 'cardProvider',
  provider: Promise<CardProvider> | undefined,
  view: EditorView,
) => {
  if (!provider) {
    return;
  }

  provider.then((cardProvider: CardProvider) => {
    const { state, dispatch } = view;
    dispatch(setProvider(cardProvider)(state.tr));
  });
};
