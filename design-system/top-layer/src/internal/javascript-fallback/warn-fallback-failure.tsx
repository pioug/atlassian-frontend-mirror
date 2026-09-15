import warnOnce from '@atlaskit/ds-lib/warn-once';

/**
 * Callers on the JavaScript fallback path degrade rather than throw, so this is
 * the only signal that a popover is not where it should be.
 */
export function warnFallbackFailure({ error }: { error: unknown }): void {
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	warnOnce(
		`@atlaskit/top-layer: the JavaScript positioning fallback hit an error, so this popover may be positioned incorrectly. ${String(
			error,
		)}`,
	);
}
