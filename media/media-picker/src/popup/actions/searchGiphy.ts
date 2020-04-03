import { ImageCardModel } from '../tools/fetcher/fetcher';
import { Action } from 'redux';

export const SEARCH_GIPHY = 'SEARCH_GIPHY';
export const SEARCH_GIPHY_FULFILLED = 'SEARCH_GIPHY_FULFILLED';
export const SEARCH_GIPHY_FAILED = 'SEARCH_GIPHY_FAILED';

export interface SearchGiphyAction extends Action {
  readonly type: 'SEARCH_GIPHY';
  readonly query: string;
  readonly shouldAppendResults: boolean;
}

export function isSearchGiphyAction(
  action: Action,
): action is SearchGiphyAction {
  return action.type === SEARCH_GIPHY;
}

export function searchGiphy(
  query: string,
  shouldAppendResults: boolean,
): SearchGiphyAction {
  return {
    type: SEARCH_GIPHY,
    query,
    shouldAppendResults,
  };
}

export interface SearchGiphyFulfilledAction extends Action {
  readonly type: 'SEARCH_GIPHY_FULFILLED';
  readonly totalResultCount: number;
  readonly imageCardModels: ImageCardModel[];
  readonly shouldAppendResults: boolean;
}

export function isSearchGiphyFulfilledAction(
  action: Action,
): action is SearchGiphyFulfilledAction {
  return action.type === SEARCH_GIPHY_FULFILLED;
}

export function searchGiphyFulfilled(
  imageCardModels: ImageCardModel[],
  totalResultCount: number,
  shouldAppendResults: boolean,
): SearchGiphyFulfilledAction {
  return {
    type: SEARCH_GIPHY_FULFILLED,
    imageCardModels,
    totalResultCount,
    shouldAppendResults,
  };
}

export interface SearchGiphyFailedAction extends Action {
  readonly type: 'SEARCH_GIPHY_FAILED';
}

export function isSearchGiphyFailedAction(
  action: Action,
): action is SearchGiphyFailedAction {
  return action.type === SEARCH_GIPHY_FAILED;
}

export function searchGiphyFailed(): SearchGiphyFailedAction {
  return {
    type: SEARCH_GIPHY_FAILED,
  };
}
