/**
 * Whether `specifier` loads `packageName` or one of its subpaths. A scope, such as
 * `'@floating-ui'`, matches every package in that scope.
 */
export function isModuleFromPackage({
	specifier,
	packageName,
}: {
	specifier: string;
	packageName: string;
}): boolean {
	return specifier === packageName || specifier.startsWith(`${packageName}/`);
}
