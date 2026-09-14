import { type AvailableSite } from '../useAvailableSites/types';
import { useAvailableSites } from '../useAvailableSites/useAvailableSites';

export const useCloudIdToUrl = (
	cloudId: string,
	gatewayBaseUrl?: string,
):
	| {
			data: string;
			error: Error | undefined;
			loading: boolean;
	  }
	| {
			data: undefined;
			error: Error | undefined;
			loading: boolean;
	  } => {
	const { data, loading, error } = useAvailableSites({ gatewayBaseUrl });

	const filterData = data.filter((site: AvailableSite) => site.cloudId === cloudId);

	if (filterData.length > 0) {
		return {
			data: filterData[0].url,
			loading,
			error,
		};
	}
	return {
		data: undefined,
		loading,
		error,
	};
};
