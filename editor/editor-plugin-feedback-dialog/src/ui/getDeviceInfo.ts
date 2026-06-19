/**
 * Inspired from:
 * https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
 */

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WIN16_REGEX = /Win16/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_95_REGEX = /(Windows 95|Win95|Windows_95)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_ME_REGEX = /(Win 9x 4.90|Windows ME)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_98_REGEX = /(Windows 98|Win98)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_CE_REGEX = /Windows CE/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_2000_REGEX = /(Windows NT 5.0|Windows 2000)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_XP_REGEX = /(Windows NT 5.1|Windows XP)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_SERVER_2003_REGEX = /Windows NT 5.2/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_VISTA_REGEX = /Windows NT 6.0/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_7_REGEX = /(Windows 7|Windows NT 6.1)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_8_1_REGEX = /(Windows 8.1|Windows NT 6.3)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_8_REGEX = /(Windows 8|Windows NT 6.2)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_NT_4_REGEX = /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ANDROID_REGEX = /Android/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const OPEN_BSD_REGEX = /OpenBSD/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const SUN_OS_REGEX = /SunOS/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const LINUX_REGEX = /(Linux|X11)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const IOS_REGEX = /(iPhone|iPad|iPod)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const MAC_OS_X_REGEX = /Mac OS X/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const MAC_OS_REGEX = /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const QNX_REGEX = /QNX/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const UNIX_REGEX = /UNIX/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const BEOS_REGEX = /BeOS/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const OS2_REGEX = /OS\/2/;
// Ignored via go/ees005
/* eslint-disable require-unicode-regexp */
const SEARCH_BOT_REGEX = /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/;
/* eslint-enable require-unicode-regexp */
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_TEST_REGEX = /Windows/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_VERSION_REGEX = /Windows (.*)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const MAC_OS_X_VERSION_REGEX = /Mac OS X (10[\.\_\d]+)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ANDROID_VERSION_REGEX = /Android ([\.\_\d]+)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const IOS_VERSION_REGEX = /OS (\d+)_(\d+)_?(\d+)?/;

const getDeviceInfo = (nAgt: string, nVersion: string) => {
	let os = '';
	let osVersion: string | null = '';

	const clientStrings = [
		{ s: 'Windows 3.11', r: WIN16_REGEX },
		{ s: 'Windows 95', r: WINDOWS_95_REGEX },
		{ s: 'Windows ME', r: WINDOWS_ME_REGEX },
		{ s: 'Windows 98', r: WINDOWS_98_REGEX },
		{ s: 'Windows CE', r: WINDOWS_CE_REGEX },
		{ s: 'Windows 2000', r: WINDOWS_2000_REGEX },
		{ s: 'Windows XP', r: WINDOWS_XP_REGEX },
		{ s: 'Windows Server 2003', r: WINDOWS_SERVER_2003_REGEX },
		{ s: 'Windows Vista', r: WINDOWS_VISTA_REGEX },
		{ s: 'Windows 7', r: WINDOWS_7_REGEX },
		{ s: 'Windows 8.1', r: WINDOWS_8_1_REGEX },
		{ s: 'Windows 8', r: WINDOWS_8_REGEX },
		{ s: 'Windows NT 4.0', r: WINDOWS_NT_4_REGEX },
		{ s: 'Android', r: ANDROID_REGEX },
		{ s: 'Open BSD', r: OPEN_BSD_REGEX },
		{ s: 'Sun OS', r: SUN_OS_REGEX },
		{ s: 'Linux', r: LINUX_REGEX },
		{ s: 'iOS', r: IOS_REGEX },
		{ s: 'Mac OS X', r: MAC_OS_X_REGEX },
		{ s: 'Mac OS', r: MAC_OS_REGEX },
		{ s: 'QNX', r: QNX_REGEX },
		{ s: 'UNIX', r: UNIX_REGEX },
		{ s: 'BeOS', r: BEOS_REGEX },
		{ s: 'OS/2', r: OS2_REGEX },
		{
			s: 'Search Bot',
			r: SEARCH_BOT_REGEX,
		},
	];
	// eslint-disable-next-line guard-for-in
	for (const client in clientStrings) {
		const clientObj = clientStrings[client];
		if (clientObj.r.test(nAgt)) {
			os = clientObj.s;
			break;
		}
	}

	let match;
	if (WINDOWS_TEST_REGEX.test(os)) {
		match = WINDOWS_VERSION_REGEX.exec(os);
		osVersion = match && match[1];
		os = 'Windows';
	}

	switch (os) {
		case 'Mac OS X':
			match = MAC_OS_X_VERSION_REGEX.exec(nAgt);
			osVersion = match && match[1];
			break;
		case 'Android':
			match = ANDROID_VERSION_REGEX.exec(nAgt);
			osVersion = match && match[1];
			break;
		case 'iOS':
			match = IOS_VERSION_REGEX.exec(nVersion);
			osVersion = match && match[1] + '.' + match[2] + '.' + (match[3] || 0);
	}
	return `${os} ${osVersion}`;
};

export default getDeviceInfo;
