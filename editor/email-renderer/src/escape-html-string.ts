export const escapeHtmlString = (content: string | undefined | null) => {
	if (!content) {
		return '';
	}

	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const escapedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

	return escapedContent;
};
