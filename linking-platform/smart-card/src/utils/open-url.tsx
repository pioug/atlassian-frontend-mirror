export const openUrl = async (url?: string): Promise<void> => {
	if (!url) {
		return;
	}
	window.open(url, '_blank', 'noopener=yes');
};
