import { useAvailableSites } from '../useAvailableSites';
import { type AvailableSite } from '../useAvailableSites/types';

export const useCloudIdToUrl = (
	cloudId: string,
	gatewayBaseUrl?: string,
):
	| {
			data: string;
			loading: boolean;
			error: Error | undefined;
	  }
	| {
			data: undefined;
			loading: boolean;
			error: Error | undefined;
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
