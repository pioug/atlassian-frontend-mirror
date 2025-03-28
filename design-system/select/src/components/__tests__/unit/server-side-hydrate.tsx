import React from 'react';

import { doesRenderWithSsr, hydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../../examples/00-single-select';

test('should ssr then hydrate correctly', async () => {
	expect(await doesRenderWithSsr(<Example />)).toBe(true);

	const { passed, collatedErrors } = await hydrateWithSsr(<Example />);
	expect(passed).toBe(false);
	expect(collatedErrors).toEqual([
		expect.stringMatching(
			/Warning: Prop `id` did not match. Server: "react-select-[\d]+-live-region" Client: "react-select-[\d]+-live-region"/,
		),
	]);
});
