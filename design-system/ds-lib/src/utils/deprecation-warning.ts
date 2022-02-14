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
    `[${packageName}]: The ${api} is deprecated.${
      additionalMessage && ` ${additionalMessage}`
    }`,
  );
}
