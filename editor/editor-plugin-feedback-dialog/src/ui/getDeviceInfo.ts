/**
 * Inspired from:
 * https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
 */
const getDeviceInfo = (nAgt: string, nVersion: string) => {
	let os = '';
	let osVersion: string | null = '';

	const clientStrings = [
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 3.11', r: /Win16/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 98', r: /(Windows 98|Win98)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows CE', r: /Windows CE/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows Server 2003', r: /Windows NT 5.2/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows Vista', r: /Windows NT 6.0/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Android', r: /Android/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Open BSD', r: /OpenBSD/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Sun OS', r: /SunOS/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Linux', r: /(Linux|X11)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'iOS', r: /(iPhone|iPad|iPod)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Mac OS X', r: /Mac OS X/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'QNX', r: /QNX/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'UNIX', r: /UNIX/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'BeOS', r: /BeOS/ },
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		{ s: 'OS/2', r: /OS\/2/ },
		{
			s: 'Search Bot',
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
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
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	if (/Windows/.test(os)) {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		match = /Windows (.*)/.exec(os);
		osVersion = match && match[1];
		os = 'Windows';
	}

	switch (os) {
		case 'Mac OS X':
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			match = /Mac OS X (10[\.\_\d]+)/.exec(nAgt);
			osVersion = match && match[1];
			break;
		case 'Android':
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			match = /Android ([\.\_\d]+)/.exec(nAgt);
			osVersion = match && match[1];
			break;
		case 'iOS':
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			match = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVersion);
			osVersion = match && match[1] + '.' + match[2] + '.' + (match[3] || 0);
	}
	return `${os} ${osVersion}`;
};

export default getDeviceInfo;
