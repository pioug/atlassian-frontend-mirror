export const getAvatarText = (spaceName: string): string => {
	return spaceName?.trim().length ? spaceName.trim()[0].toUpperCase() : '';
};
