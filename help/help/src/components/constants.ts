export const MIN_CHARACTERS_FOR_SEARCH = 3;
export const LOADING_TIMEOUT = 1000;

export enum VIEW {
  DEFAULT_CONTENT = 'DEFAULT_CONTENT',
  ARTICLE = 'ARTICLE',
  ARTICLE_NAVIGATION = 'ARTICLE_NAVIGATION',
  SEARCH = 'SEARCH',
}

// Animation related consts
export const TRANSITION_DURATION_MS = 300;
export const SEARCH_RESULTS_FADEIN_TRANSITION_DURATION_MS = 440;

export enum TRANSITION_STATUS {
  UNMOUNTED = 'unmounted',
  EXITED = 'exited',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting',
}
