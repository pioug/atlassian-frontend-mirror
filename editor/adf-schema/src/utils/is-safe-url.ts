/**
 * This file has been partially duplicated in packages/linking-platform/linking-common/src/url.ts
 * Any changes made here should be mirrored there.
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

const whitelistedURLPatterns = [
	/^https?:\/\//imu,
	/^ftps?:\/\//imu,
	/^gopher:\/\//imu,
	/^integrity:\/\//imu,
	/^file:\/\//imu,
	/^smb:\/\//imu,
	/^dynamicsnav:\/\//imu,
	/^jamfselfservice:\/\//imu,
	/^\//imu,
	/^mailto:/imu,
	/^skype:/imu,
	/^callto:/imu,
	/^facetime:/imu,
	/^git:/imu,
	/^irc6?:/imu,
	/^news:/imu,
	/^nntp:/imu,
	/^feed:/imu,
	/^cvs:/imu,
	/^svn:/imu,
	/^mvn:/imu,
	/^ssh:/imu,
	/^scp:\/\//imu,
	/^sftp:\/\//imu,
	/^itms:/imu,
	// This is not a valid notes link, but we support this pattern for backwards compatibility
	/^notes:/imu,
	/^notes:\/\//imu,
	/^hipchat:\/\//imu,
	// This is not a valid sourcetree link, but we support this pattern for backwards compatibility
	/^sourcetree:/imu,
	/^sourcetree:\/\//imu,
	/^urn:/imu,
	/^tel:/imu,
	/^xmpp:/imu,
	/^telnet:/imu,
	/^vnc:/imu,
	/^rdp:/imu,
	/^whatsapp:/imu,
	/^slack:/imu,
	/^sips?:/imu,
	/^magnet:/imu,
	/^#/imu,
];

/**
 * Please notify the Editor Mobile team (Slack: #help-mobilekit) if the logic for this changes.
 */
export const isSafeUrl = (url: string | undefined): boolean => {
	const urlTrimmed = url?.trim();

	if (urlTrimmed === undefined) {
		return true;
	}

	if (urlTrimmed.length === 0) {
		return true;
	}
	return whitelistedURLPatterns.some((p) => p.test(urlTrimmed));
};
