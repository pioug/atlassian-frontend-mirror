import { useCallback } from 'react';
import { useSmartLinkContext } from '../context';

export function usePrefetch(url: string) {
  const { store, prefetchStore, connections } = useSmartLinkContext();
  const { dispatch, getState } = store;
  const { client } = connections;

  return useCallback(async () => {
    // If the link is already being prefetched, the prefetch store
    // should have a flag set against the URL. The prefetch store is purposefully
    // separate from the UI in order to ensure no rendering takes place;
    // all mutations which occur are purely store-based mutations.
    const isPrefetching = prefetchStore[url];
    // If the link has already been registered in the store, then it no
    // longer needs to be prefetched, as the normal flow of a link being in
    // the viewport and being fetched is now in motion.
    const isFetching = getState()[url];
    // We compute if a link needs to be prefetched thus, referencing the above.
    const needsPrefetch = !isPrefetching && !isFetching;

    if (needsPrefetch) {
      // We specify in the prefetch store that this link no
      // longer needs to be prefetched. Data which comes back
      // from a successful prefetch flow here will be used to
      // render all URLs which are the same.
      prefetchStore[url] = true;
      // Try fetch the data for this URL from Object Resolver Service (ORS), executing batch
      // requests by domain (as usual) to ensure we minimize the amount of connections
      // we create between browser -> ORS when making network requests.
      try {
        const response = await client.prefetchData(url);
        // Once the data comes back, we put the link in the `resolved` status. This ensures
        // that when the link enters the viewport and is rendered, we immediately show it as
        // a Smart Link, rather than rendering a loading spinner -> immediate Smart Link.
        if (response) {
          dispatch({ type: 'resolved', url, payload: response });
        }
      } catch (_err) {
        // Do nothing, link will be retried under the hood with exponential backoff.
        // If it does not succeed even after those retries, the normal resolve flow
        // will start when the link is in view. Since we have not performed any store
        // mutations yet, the link will behave like a 'brand new' link.
      }
    }
  }, [prefetchStore, url, getState, client, dispatch]);
}
