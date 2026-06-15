/* eslint-disable no-console */
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

// The top-layer polyfill that adds `HTMLDialogElement.prototype.showModal` to
// jsdom is loaded globally for this package's unit tests. We do not need to
// import it explicitly here - see `src/testing/polyfill.tsx`.

jest.spyOn(console, 'error').mockImplementation(() => {});

afterEach(() => {
	jest.resetAllMocks();
});

/**
 * Validates that an `isOpen={true}` dialog can be server-rendered and
 * hydrated without producing React hydration mismatch warnings.
 *
 * The behavioural side of the SSR + hydration contract (invisible at SSR,
 * open after hydrate, animated in) is covered by the Playwright spec at
 * `__tests__/playwright/ssr-dialog.spec.tsx` and the informational VR
 * fixture at `__tests__/informational-vr-tests/ssr-dialog.vr.tsx`, which
 * run in a real browser where `dialog.showModal()` actually does something.
 *
 * This test guards specifically against the failure mode that those tests
 * cannot easily catch: SSR/CSR markup drift that would surface as a
 * hydration warning in a consumer app.
 */
test('dialog with isOpen=true on initial render hydrates without warnings', async () => {
	const examplePath = require.resolve('../../examples/151-testing-dialog-ssr-initial-open');

	const { html, styles } = await ssr(examplePath);

	const elem = document.createElement('div');
	elem.innerHTML = html;
	document.body.appendChild(elem);

	await hydrateWithAct(examplePath, elem, styles, true);

	// Filter out known React warnings about the native `<dialog>` element,
	// which React does not fully support in SSR yet. These are expected and
	// covered (filtered the same way) by `ssr.tsx`.
	const unexpectedErrors = (console.error as jest.Mock).mock.calls.filter((call: unknown[]) => {
		const message = call.map(String).join(' ');
		return !message.includes('dialog');
	});
	expect(unexpectedErrors).toEqual([]);

	cleanup();
});
