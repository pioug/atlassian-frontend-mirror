import { type AvailableSite, type AvailableSitesProductType } from '../types';

/**
 * Given a set of products, returns a predicate function that can be used to filter an array of available sites
 * where sites feature at least one of the given products.
 *
 * @param availableSitesProducts
 */
export const filterSiteProducts = (availableSitesProducts: AvailableSitesProductType[]) => {
	return (site: AvailableSite) => {
		return site.products.some((product) => availableSitesProducts.includes(product));
	};
};
