import warnOnce from './warn-once';

/**
 * Will print an API deprecation warning message in the console once per session.
 *
 * @param packageName       The package of the API being deprecated, eg `@atlaskit/button`
 * @param api               The API being deprecated - a component, API, prop
 * @param additionalMessage Additional guidance / next steps if applicable
 *
 * @example
 *
 * ```js
 * deprecationWarning('@atlaskit/button', 'className prop', 'This API will stop working in the next major version.')
 * ```
 */
export default function deprecationWarning(
	packageName: string,
	api: string,
	additionalMessage?: string,
): void {
	warnOnce(
		`[${packageName}]: The ${api} is deprecated.${additionalMessage && ` ${additionalMessage}`}`,
	);
}

/**
 * Logs a prop deprecation warning to console once during a session.
 *
 * @param packageName Use `process.env._PACKAGE_NAME_` instead of a static string.
 * @param propName Prop that is deprecated.
 * @param predicate If true the deprecation warning will be logged to console.
 * @param deprecationAnnouncementOnDAC Link to the public announcement on DAC.
 */
export function propDeprecationWarning(
	packageName: string,
	propName: string,
	predicate: boolean,
	deprecationAnnouncementOnDAC: string,
): void {
	if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && predicate) {
		warnOnce(
			`[${packageName}]: The ${propName} prop is deprecated and will be removed, please migrate away.
Public announcement: ${deprecationAnnouncementOnDAC}`,
		);
	}
}
