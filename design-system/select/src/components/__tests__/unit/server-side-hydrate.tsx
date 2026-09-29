import React from 'react';

import { doesRenderWithSsr, hydrateWithSsr } from '@atlassian/ssr-tests';

import Example from '../../../../examples/00-single-select.vr.ap';

test('should ssr then hydrate correctly', async () => {
	expect(await doesRenderWithSsr(<Example />)).toBe(true);

	const { passed, collatedErrors } = await hydrateWithSsr(<Example />);
	expect(passed).toBe(false);
	// react-select's internal instanceId counter increments on every render, so the id
	// generated during the server render never matches the id generated on hydration.
	// The exact wording of React's hydration-mismatch warning differs between major
	// versions (React 18 reports one warning per mismatched prop; React 19 reports a
	// single consolidated diff), so match on the id mismatch itself rather than the
	// full message text.
	expect(collatedErrors).toHaveLength(1);
	expect(collatedErrors[0]).toMatch(
		/id="react-select-[\d]+-live-region"[\s\S]*id="react-select-[\d]+-live-region"|Server: "react-select-[\d]+-live-region" Client: "react-select-[\d]+-live-region"/,
	);
});
