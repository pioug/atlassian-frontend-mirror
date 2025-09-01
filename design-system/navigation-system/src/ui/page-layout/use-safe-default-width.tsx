import { fg } from '@atlaskit/platform-feature-flags';

/**
 * When `platform_dst_nav4_panel_splitter_guards` is disabled,
 * `useSafeDefaultWidth` returns the provided `defaultWidthProp`.
 *
 * When `platform_dst_nav4_panel_splitter_guards` is enabled,
 * `useSafeDefaultWidth` returns the `fallbackWidth` if the provided `defaultWidthProp` is not an integer value.
 */
export function useSafeDefaultWidth({
	defaultWidthProp,
	fallbackDefaultWidth,
	slotName,
}: {
	/**
	 * The `defaultWidth` passed in by the app.
	 */
	defaultWidthProp: number;
	/**
	 * The fallback value for `defaultWidth` if `defaultWidthProp` is invalid.
	 */
	fallbackDefaultWidth: number;
	/**
	 * The name of the slot, used for the dev-time console error.
	 */
	slotName: string;
}) {
	if (fg('platform_dst_nav4_panel_splitter_guards')) {
		// If the provided `defaultWidth` is invalid then we use our fallback.
		// We are using a runtime check because some invalid numbers like `NaN` are not caught by types,
		// and we saw some issues in products where our experience broke due to this.
		if (!Number.isInteger(defaultWidthProp)) {
			if (process.env.NODE_ENV !== 'production') {
				// eslint-disable-next-line no-console
				console.error(
					`The defaultWidth value must be an integer, but '${defaultWidthProp}' was provided to ${slotName}. Falling back to ${fallbackDefaultWidth}px instead.`,
				);
			}

			return fallbackDefaultWidth;
		}
	}

	return defaultWidthProp;
}
