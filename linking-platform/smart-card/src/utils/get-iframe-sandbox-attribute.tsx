export const getIframeSandboxAttribute = (
	isTrusted: boolean,
):
	| 'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts'
	| undefined => {
	if (isTrusted) {
		return undefined;
	}

	const sandboxPermissions =
		'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts';

	return sandboxPermissions;
};
