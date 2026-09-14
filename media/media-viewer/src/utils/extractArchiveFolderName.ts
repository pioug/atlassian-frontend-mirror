export const extractArchiveFolderName = (folderName: string): string => {
	const index = folderName.lastIndexOf('.');
	return index > -1 ? folderName.substring(0, index) + '/' : folderName + '/';
};
