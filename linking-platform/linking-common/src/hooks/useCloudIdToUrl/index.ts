import { useAvailableSites } from '../useAvailableSites';
import { AvailableSite } from '../useAvailableSites/types';

export const useCloudIdToUrl = (cloudId: string, gatewayBaseUrl?: string) => {
  const { data, loading, error } = useAvailableSites({ gatewayBaseUrl });

  const filterData = data.filter(
    (site: AvailableSite) => site.cloudId === cloudId,
  );

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
