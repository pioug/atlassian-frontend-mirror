/**
 * Extract the domain from the URL. Strips "www" subdomains
 * e.g. http://dogs.animals.com/yellow/golden-retriever becomes "dogs.animals.com"
 * e.g. http://www.blake.com/memes becomes "blake.com"
 *
 * Return an empty string if a totally invalid url is somehow passed in.
 * @param url
 */
export const getDomainFromLinkUri = (url: string): string => {
	let hostname: string;
	try {
		try {
			hostname = unsafeGetDomainFromUrl(url);
		} catch (noProtocolError) {
			/**
			 * Backend (Legion) validates whether the string is URI compliant. But URL expects
			 * the string to have a protocol. This is not validated by URI compliancy. So
			 * following is just a quick fix just for display purposes.
			 */
			hostname = unsafeGetDomainFromUrl('http://' + url);
		}
	} catch (error) {
		return '';
	}
	return hostname.replace(/^www\./, '');
};

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
