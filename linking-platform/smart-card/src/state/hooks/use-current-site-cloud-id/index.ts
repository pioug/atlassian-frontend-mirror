import { useEffect, useState } from 'react';

import { getCurrentSiteCloudId } from '../../services/current-site-cloud-id';

export {
	CURRENT_SITE_CLOUD_ID_LOCAL_STORAGE_KEY,
	CURRENT_SITE_CLOUD_ID_STORAGE_ITEM_KEY,
	currentSiteCloudIdService,
	getCurrentSiteCloudId,
	getCachedCurrentSiteCloudIdAndRefresh,
} from '../../services/current-site-cloud-id';

const useCurrentSiteCloudId = (): { cloudId: string | undefined; isLoading: boolean } => {
	const [cloudId, setCloudId] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		void getCurrentSiteCloudId()
			.then((id) => {
				if (!cancelled) {
					setCloudId(id);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoading(false);
				}
			});
		return () => {
			cancelled = true;
		};
	}, []);

	return { cloudId, isLoading };
};

export default useCurrentSiteCloudId;
