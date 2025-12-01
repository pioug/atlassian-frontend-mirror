import { useEffect, useMemo, useState } from 'react';

import type { Site } from '../common/types';

import { getAccessibleProducts } from './getAvailableSites';

export const useAvailableSites = (product: 'confluence' | 'jira', cloudId?: string) => {
	const [availableSites, setAvailableSites] = useState<Site[] | undefined>(undefined);

	useEffect(() => {
		const fetchSiteDisplayNames = async () => {
			const sites = await getAccessibleProducts(product);
			const sortedAvailableSites = [...sites].sort((a, b) =>
				a.displayName.localeCompare(b.displayName),
			);
			setAvailableSites(sortedAvailableSites);
		};

		void fetchSiteDisplayNames();
	}, [product]);

	const selectedSite = useMemo<Site | undefined>(() => {
		if (cloudId) {
			return availableSites?.find((site) => site.cloudId === cloudId);
		}

		let currentlyLoggedInSiteUrl: string | undefined;
		if (typeof window.location !== 'undefined') {
			currentlyLoggedInSiteUrl = window.location.origin;
		}
		return (
			availableSites?.find((site) => site.url === currentlyLoggedInSiteUrl) || availableSites?.[0]
		);
	}, [availableSites, cloudId]);

	return { availableSites, selectedSite };
};
