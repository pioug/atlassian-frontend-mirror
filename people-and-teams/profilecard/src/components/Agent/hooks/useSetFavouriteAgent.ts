import { useState } from 'react';

import { createHeaders } from '../../../util/rovoAgentUtils';

export const useSetFavouriteAgent = ({
	agentId,
	cloudId,
	isStarred,
	product,
}: {
	agentId?: string;
	cloudId?: string;
	isStarred: boolean;
	product: string;
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFavourite, setIsFavourite] = useState(isStarred);

	const setFavourite = async () => {
		if (!agentId || !cloudId) {
			return;
		}
		setIsLoading(true);
		try {
			const headers = createHeaders(product, cloudId);

			if (isFavourite) {
				await fetch(
					new Request(`/gateway/api/assist/agents/v1/${agentId}/favourite`, {
						method: 'POST',
						credentials: 'include',
						mode: 'cors',
						headers,
					}),
				).then(() => {
					setIsFavourite(true);
				});
			} else {
				await fetch(
					new Request(`/gateway/api/assist/agents/v1/${agentId}/favourite`, {
						method: 'DELETE',
						credentials: 'include',
						mode: 'cors',
						headers,
					}),
				).then(() => {
					setIsFavourite(false);
				});
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		isStarred: isFavourite,
		// hasError: Boolean(error) || cannotLoadUser,
		setFavourite,
	};
};
