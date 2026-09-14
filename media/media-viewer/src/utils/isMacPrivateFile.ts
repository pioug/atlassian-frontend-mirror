export const isMacPrivateFile = (fileName: string): boolean => {
	return fileName.startsWith('__MACOSX') || fileName.includes('.DS_Store');
};
