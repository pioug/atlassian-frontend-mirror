import {
  isSearchGiphyAction,
  searchGiphyFulfilled,
  searchGiphyFailed,
} from '../actions/searchGiphy';
import { Store, Dispatch, Action } from 'redux';

import { State } from '../domain';
import { Fetcher } from '../tools/fetcher/fetcher';

export interface TrendingGifsParams {
  readonly offset?: number;
  readonly query: string;
  readonly shouldAppendResults: boolean;
}

export default (fetcher: Fetcher) => (store: Store<State>) => (
  next: Dispatch<State>,
) => (action: Action) => {
  if (isSearchGiphyAction(action)) {
    const { query, shouldAppendResults } = action;
    const { imageCardModels } = store.getState().giphy;
    const offset = shouldAppendResults ? imageCardModels.length + 1 : undefined;

    fetchGifs(fetcher, store, { query, offset, shouldAppendResults });
  }

  return next(action);
};

export const fetchGifs = async (
  fetcher: Fetcher,
  store: Store<State>,
  params: TrendingGifsParams,
): Promise<void> => {
  const { query, offset, shouldAppendResults } = params;

  try {
    const { cardModels, totalResultCount } =
      query.length > 0
        ? await fetcher.fetchGifsRelevantToSearch(query, offset)
        : await fetcher.fetchTrendingGifs(offset);

    store.dispatch(
      searchGiphyFulfilled(cardModels, totalResultCount, shouldAppendResults),
    );
  } catch (e) {
    store.dispatch(searchGiphyFailed());
  }
};
