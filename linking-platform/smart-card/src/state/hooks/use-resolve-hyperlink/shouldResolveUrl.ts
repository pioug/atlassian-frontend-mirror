const allowedHostnames = [
	'sharepoint.com',
	'onedrive.live.com',
	'docs.google.com',
	'drive.google.com',
];

export const shouldResolveUrl = (href: string): boolean => {
	try {
		const hostname = new URL(href).hostname.toLowerCase();
		return allowedHostnames.some((allowedHostname) => hostname.includes(allowedHostname));
	} catch {
		return false;
	}
};
