import { unsafeGetDomainFromUrl } from './unsafe-get-domain-from-url';

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
