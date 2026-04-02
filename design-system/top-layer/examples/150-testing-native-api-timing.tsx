import React from 'react';

/**
 * Minimal test fixture for native popover/dialog API timing browser tests.
 *
 * The actual assertions live in the Playwright spec and run via `page.evaluate()`,
 * which creates native elements directly in the browser DOM.
 * This example simply provides a page to load.
 */
export default function TestingNativeApiTiming(): React.JSX.Element {
	return <div data-testid="container">Native API timing test fixture</div>;
}
