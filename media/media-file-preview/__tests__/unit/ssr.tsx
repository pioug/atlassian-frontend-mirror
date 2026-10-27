import React from 'react';

import { hydrateWithSsr } from '@atlassian/ssr-tests/ssr-tests';

import Example from '../../examples/00-use-media-image';

test('should ssr then hydrate example component correctly', async () => {
	const consoleError = jest.spyOn(console, 'error');
	// Keep the calls because the helper restores its console spy before returning.
	const consoleErrors = consoleError.mock.calls;
	const result = await hydrateWithSsr(<Example />);

	expect(result.collatedErrors).toEqual([]);
	// The helper's collector currently ignores recoverable errors passed as Error objects.
	expect(consoleErrors.filter(([error]) => error instanceof Error)).toEqual([]);
});
