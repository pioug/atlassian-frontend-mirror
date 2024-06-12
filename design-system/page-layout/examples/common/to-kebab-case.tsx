const toKebabCase = (str: string): string => {
	return str.replace(/[A-Z]/g, (substring: string, index: number) => {
		if (index === 0) {
			return substring.toLowerCase();
		}
		return `-${substring.toLowerCase()}`;
	});
};

export default toKebabCase;
