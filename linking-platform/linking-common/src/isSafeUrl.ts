/**
 * This file has been partially duplicated in packages/editor/adf-schema/src/utils/url.ts
 * Any changes made here should be mirrored there until the duplicate behaviour is resolved
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

const whitelistedURLPatterns = [
	/^https?:\/\/[^\s]*$/im,
	/^ftps?:\/\//im,
	/^gopher:\/\//im,
	/^integrity:\/\//im,
	/^file:\/\//im,
	/^smb:\/\//im,
	/^dynamicsnav:\/\//im,
	/^jamfselfservice:\/\/[^\s]*$/im,
	/^\//im,
	/^mailto:/im,
	/^skype:/im,
	/^callto:[^\s]*$/im,
	/^facetime:[^\s]*$/im,
	/^git:/im,
	/^irc6?:/im,
	/^news:/im,
	/^nntp:/im,
	/^feed:/im,
	/^cvs:/im,
	/^svn:/im,
	/^mvn:/im,
	/^ssh:/im,
	/^scp:\/\//im,
	/^sftp:\/\//im,
	/^itms:/im,
	// This is not a valid notes link, but we support this pattern for backwards compatibility
	/^notes:/im,
	/^notes:\/\//im,
	/^hipchat:\/\//im,
	/^sourcetree:/im,
	/^urn:/im,
	/^tel:/im,
	/^xmpp:/im,
	/^telnet:/im,
	/^vnc:/im,
	/^rdp:/im,
	/^whatsapp:/im,
	/^slack:/im,
	/^sips?:/im,
	/^magnet:/im,
	/^foo:/im,
	/^#/im,
];

export const isSafeUrl: any = (url: string): boolean => {
	const urlTrimmed = url.trim();
	return whitelistedURLPatterns.some((p) => p.test(urlTrimmed));
};
