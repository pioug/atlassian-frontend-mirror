export const getFolderParent = (path: string): string => {
	const pathParts = path.substring(0, path.length - 1).split('/');
	pathParts.pop();
	const parent = pathParts.at(-1);

	if (!parent) {
		return ''; // root
	}

	return pathParts.join('/') + '/';
};
