export const isDoubleQuoted = (maybeQuotedString: string): boolean => {
	if (maybeQuotedString.length < 2) {
		return false;
	}

	return (
		maybeQuotedString[0] === '"' &&
		maybeQuotedString[maybeQuotedString.length - 1] === '"' &&
		maybeQuotedString[maybeQuotedString.length - 2] !== '\\'
	);
};
