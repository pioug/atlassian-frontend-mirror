import { useState } from 'react';

import { createHeaders } from '../../../util/rovoAgentUtils';

export const useDeleteAgent = ({ cloudId, product }: { cloudId?: string; product: string }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState();

	const deleteAgent = async (agentId?: string) => {
		if (!agentId || !cloudId) {
			return;
		}
		setIsLoading(true);
		try {
			const headers = createHeaders(product, cloudId);

			await fetch(
				new Request(`/gateway/api/assist/agents/v1/${agentId}`, {
					method: 'DELETE',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			);

			setIsLoading(false);
		} catch (error: any) {
			setIsLoading(false);
			setError(error);
		}
	};

	return {
		isLoading,
		error,
		deleteAgent,
	};
};
