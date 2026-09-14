/**
 * Extract the domain from the URL.
 * Throws if url param is not a valid URL.
 * Marked as unsafe because the URL constructor throws Type Errors when it
 * receives invalid URLs. Feel free to use this method with adequate care.
 */
export const unsafeGetDomainFromUrl = (url: string): string => {
	const urlObj = new URL(url);
	return urlObj.hostname;
};
