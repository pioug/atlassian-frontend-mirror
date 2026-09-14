export const getFormattedFolderName = (folderName: string): string => {
	// We assume name ends with '/' unless it is the root directory
	if (folderName === '') {
		return '';
	}

	const name = folderName.substring(0, folderName.length - 1);
	const index = name.lastIndexOf('/');
	if (index === -1) {
		return name;
	}
	return name.substring(index + 1);
};
