const UUID_REGEX = new RegExp(/((\w{4,12}-?)){5}/g);

export const stripUUIDFromPath = (path: string): string => {
	return path.replace(UUID_REGEX, '<UUID>');
};
