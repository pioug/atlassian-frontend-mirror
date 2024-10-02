import { useContext } from 'react';

import { OpenLayerCount } from './open-layer-count-context';

/**
 * Returns a ref object that contains the number of layering components (e.g. popups, dropdown menus) that are currently open under the observer.
 */
export const useOpenLayerCount = () => {
	return useContext(OpenLayerCount);
};
