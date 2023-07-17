import { EditorView } from 'prosemirror-view';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { CardOptions } from '@atlaskit/editor-common/card';
import {
  CardAdf,
  CardProvider,
  DatasourceAdf,
} from '@atlaskit/editor-common/provider-factory';

import { Request } from '../../types';
import { setProvider } from '../actions';
import { handleFallbackWithAnalytics, replaceQueuedUrlWithCard } from '../doc';

// ============================================================================ //
// ============================== PROVIDER UTILS ============================== //
// ============================================================================ //
// Used for all interactions with the EditorCardProvider.
// ============================================================================ //
export const resolveWithProvider = (
  view: EditorView,
  provider: CardProvider,
  request: Request,
  options: CardOptions,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
) => {
  // When user manually changes appearance from blue link to smart link, we should respect that,
  let shouldForceAppearance =
    // This flag is set to true only in one place atm:
    // packages/editor/editor-core/src/plugins/card/pm-plugins/doc.ts @ convertHyperlinkToSmartCard
    // Which is used when user switching from URL to smart link appearance.
    !!request.shouldReplaceLink;
  const handleResolve = provider
    .resolve(request.url, request.appearance, shouldForceAppearance)
    .then(
      handleResolved(
        view,
        request,
        editorAnalyticsApi,
        createAnalyticsEvent,
        options,
      ),
      handleRejected(view, request, editorAnalyticsApi),
    );

  return handleResolve;
};

const updateCardType = (
  resolvedCard: CardAdf | DatasourceAdf,
  options: CardOptions,
) => {
  if (
    (resolvedCard?.type === 'blockCard' && !options.allowBlockCards) ||
    (resolvedCard?.type === 'embedCard' && !options.allowEmbeds)
  ) {
    // clean out the 'layout' attr from an embedCard type that should be transformed into the inlineCard type.
    if (resolvedCard.type === 'embedCard') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (resolvedCard as any).attrs.layout;
    }
    (resolvedCard as CardAdf).type = 'inlineCard';
  }
};

const handleResolved =
  (
    view: EditorView,
    request: Request,
    editorAnalyticsApi: EditorAnalyticsAPI | undefined,
    createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
    options: CardOptions,
  ) =>
  (resolvedCard: CardAdf | DatasourceAdf) => {
    updateCardType(resolvedCard, options);
    replaceQueuedUrlWithCard(
      request.url,
      resolvedCard,
      request.analyticsAction,
      editorAnalyticsApi,
      createAnalyticsEvent,
    )(view.state, view.dispatch);
    return resolvedCard;
  };

const handleRejected =
  (
    view: EditorView,
    request: Request,
    editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  ) =>
  () => {
    handleFallbackWithAnalytics(request, editorAnalyticsApi)(
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
