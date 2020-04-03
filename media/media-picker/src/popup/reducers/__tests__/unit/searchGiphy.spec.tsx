import {
  searchGiphy,
  searchGiphyFulfilled,
  searchGiphyFailed,
} from '../../../actions';
import {
  giphySearchStarted,
  giphySearchFullfilled,
  giphySearchFailed,
} from '../../searchGiphy';

describe('searchGiphy', () => {
  const stateBase = {
    a: 12,
    b: 'abc',
  };

  const state = {
    ...stateBase,
    view: {
      isUploading: 'some-upload-status',
      items: 'some-items',
    },
    giphy: {
      imageCardModels: [
        'already-existing-result-1',
        'already-existing-result-2',
      ],
    },
  };

  describe('giphySearchStarted()', () => {
    it('should return original state for unknown action', () => {
      const oldState: any = { ...state };
      const newState = giphySearchStarted(oldState, { type: 'UNKNOWN' });

      expect(oldState).toEqual(state);
      expect(newState).toEqual(state);
    });

    it('should set the view loading state to true', () => {
      const oldState: any = { ...state };
      const newState = giphySearchStarted(oldState, searchGiphy('', false));

      expect(oldState).toEqual(state);
      expect(newState.view.isLoading).toBe(true);
    });

    it('should set the view error state to false', () => {
      const oldState: any = { ...state, view: { hasError: true } };
      const newState = giphySearchStarted(oldState, searchGiphy('', false));

      expect(newState.view.hasError).toBe(false);
    });

    it('should not change other view properties', () => {
      const oldState: any = { ...state };
      const newState = giphySearchStarted(oldState, searchGiphy('', false));

      expect(oldState).toEqual(state);
      expect(newState.view.isUploading).toBe('some-upload-status');
      expect(newState.view.items).toBe('some-items');
    });

    it('should remove previous results when shouldAppendResults is false', () => {
      const oldGiphyState = {
        imageCardModels: [1, 2, 3],
        totalResultCount: 25,
      };
      const oldState: any = { ...state, giphy: oldGiphyState };
      const newState = giphySearchStarted(oldState, searchGiphy('', false));

      expect(oldState).toEqual({ ...state, giphy: oldGiphyState });
      expect(newState.giphy).toEqual({ imageCardModels: [] });
    });

    it('should NOT remove previous giphy results when shouldAppendResults is true', () => {
      const oldGiphyState = {
        imageCardModels: [1, 2, 3],
        totalResultCount: 25,
      };
      const oldState: any = { ...state, giphy: oldGiphyState };
      const newState = giphySearchStarted(oldState, searchGiphy('', true));

      expect(oldState).toEqual({ ...state, giphy: oldGiphyState });
      expect(newState.giphy).toEqual(oldGiphyState);
    });
  });

  describe('giphySearchFullfilled()', () => {
    it('should return original state for unknown action', () => {
      const oldState: any = { ...state };
      const newState = giphySearchFullfilled(oldState, { type: 'UNKNOWN' });

      expect(oldState).toEqual(state);
      expect(newState).toEqual(state);
    });

    it('should set the view loading state to false', () => {
      const oldState: any = { ...state };
      const newState = giphySearchFullfilled(
        oldState,
        searchGiphyFulfilled([], 100, true),
      );

      expect(oldState).toEqual(state);
      expect(newState.view.isLoading).toBe(false);
    });

    it('should set the giphy.totalResultCount to the actions totalResultCount', () => {
      const oldState: any = { ...state, view: { hasError: true } };
      const newState = giphySearchFullfilled(
        oldState,
        searchGiphyFulfilled([], 100, false),
      );

      expect(newState.giphy.totalResultCount).toEqual(100);
    });

    it('should set imageCardModels to the actions imageCardModels when appendResults is false', () => {
      const oldState: any = { ...state };
      const retrievedImageResults: any = ['first-result', 'second-result'];

      const newState = giphySearchFullfilled(
        oldState,
        searchGiphyFulfilled(retrievedImageResults, 100, false),
      );

      expect(oldState).toEqual(state);
      expect(newState.giphy.imageCardModels).toEqual(retrievedImageResults);
    });

    it('should append actions imageCardModels to the states imageCardModles when appendResults is true', () => {
      const oldState: any = { ...state };
      const retrievedImageResults: any = ['first-result', 'second-result'];

      const newState = giphySearchFullfilled(
        oldState,
        searchGiphyFulfilled(retrievedImageResults, 100, true),
      );

      expect(oldState).toEqual(state);
      expect(newState.giphy.imageCardModels).toEqual([
        'already-existing-result-1',
        'already-existing-result-2',
        'first-result',
        'second-result',
      ]);
    });
  });

  describe('giphySearchFailed()', () => {
    it('should return original state for unknown action', () => {
      const oldState: any = { ...state };
      const newState = giphySearchFailed(oldState, { type: 'UNKNOWN' });

      expect(oldState).toEqual(state);
      expect(newState).toEqual(state);
    });

    it('should set the view loading state to false', () => {
      const oldState: any = { ...state };
      const newState = giphySearchFullfilled(
        oldState,
        searchGiphyFulfilled([], 100, true),
      );

      expect(oldState).toEqual(state);
      expect(newState.view.isLoading).toBe(false);
    });

    it('removes previously stored imageResults', () => {
      const oldState: any = { ...state };
      const newState = giphySearchFailed(oldState, searchGiphyFailed());

      expect(oldState).toEqual(state);
      expect(newState.giphy.imageCardModels).toEqual([]);
    });

    it('should set giphy.totalResultCount to undefined', () => {
      const oldState: any = {
        ...state,
        view: { hasError: true },
        giphy: { ...state.giphy, totalResultCount: 100 },
      };
      const newState = giphySearchFailed(oldState, searchGiphyFailed());

      expect(newState.giphy.totalResultCount).toEqual(undefined);
    });

    it('sets the view error state to true', () => {
      const oldState: any = { ...state };
      const newState = giphySearchFailed(oldState, searchGiphyFailed());

      expect(oldState).toEqual(state);
      expect(newState.view.hasError).toEqual(true);
    });
  });
});
