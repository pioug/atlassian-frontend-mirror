import { expect, test } from '@af/integration-testing';

/**
 * `test.fixme` — a deliberate parity gap, not a broken test. Legacy
 * `hasPopperEscaped` means "escaped its CLIPPING BOUNDARY"; the flag-on synthesis
 * in `internal/use-reference-visibility.tsx` means "outside the VIEWPORT", and
 * this fixture is the geometry where they disagree.
 *
 * Deferred because `hasPopperEscaped` has zero product consumers across AFM. The
 * assertion is left intact rather than weakened, so it fails again the moment
 * someone implements the legacy semantics. See
 * `top-layer/notes/migrations/popper-migration.md`.
 */

const TOP_LAYER_FLAG = 'platform-dst-top-layer';

test.fixme('hasPopperEscaped is true when popper renders outside its clipping ancestor', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/08-flag-popper-escaped.tsx')>(
		'design-system',
		'popper',
		'flag-popper-escaped',
		{ featureFlag: TOP_LAYER_FLAG },
	);
	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();
	await expect(popper).toHaveAttribute('data-has-popper-escaped', 'true');
});
