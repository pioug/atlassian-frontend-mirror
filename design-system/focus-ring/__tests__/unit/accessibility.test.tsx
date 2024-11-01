import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import FocusRing from '../../src';
import FocusRingCompiled from '../../src/compiled';

describe.each([
	['emotion', FocusRing],
	['compiled', FocusRingCompiled],
])('variant=%p', (_variant, Component) => {
	it('Basic focus ring with button should pass axe audit', async () => {
		const { container } = render(
			<Component>
				<button type="button">Native Button</button>
			</Component>,
		);
		await axe(container);
	});
});
