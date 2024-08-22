import { useState } from 'react';

export const useProfileInfo = <T>({
	fetchUserProfile,
}: {
	fetchUserProfile?: () => Promise<T>;
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState(null);
	const [profileData, setProfileData] = useState<T>();

	const getProfileData = async () => {
		setIsLoading(true);
		try {
			const profileData = await fetchUserProfile?.();
			setProfileData(profileData);
			setIsLoading(false);
		} catch (error: any) {
			setError(error);
			setIsLoading(true);
		}
	};

	return {
		profileData,
		isLoading,
		error,
		getProfileData,
	};
};
