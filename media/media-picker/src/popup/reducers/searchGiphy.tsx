import { Action } from 'redux';

import { State } from '../domain';
import {
  isSearchGiphyAction,
  isSearchGiphyFulfilledAction,
  isSearchGiphyFailedAction,
} from '../actions/searchGiphy';

export const giphySearchStarted = (state: State, action: Action): State => {
  if (isSearchGiphyAction(action)) {
    const { shouldAppendResults } = action;
    const giphy = shouldAppendResults ? state.giphy : { imageCardModels: [] };

    return {
      ...state,
      view: {
        ...state.view,
        isLoading: true,
        hasError: false,
      },
      giphy,
    };
  } else {
    return state;
  }
};

export const giphySearchFullfilled = (state: State, action: Action): State => {
  if (isSearchGiphyFulfilledAction(action)) {
    const { imageCardModels: oldImageCardModels } = state.giphy;
    const {
      imageCardModels: newImageCardModels,
      shouldAppendResults,
      totalResultCount,
    } = action;

    const imageCardModels = shouldAppendResults
      ? [...oldImageCardModels, ...newImageCardModels]
      : newImageCardModels;

    return {
      ...state,
      view: {
        ...state.view,
        isLoading: false,
      },
      giphy: {
        imageCardModels,
        totalResultCount,
      },
    };
  } else {
    return state;
  }
};

export const giphySearchFailed = (state: State, action: Action): State => {
  if (isSearchGiphyFailedAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        isLoading: false,
        hasError: true,
      },
      giphy: {
        imageCardModels: [],
        totalResultCount: undefined,
      },
    };
  } else {
    return state;
  }
};
