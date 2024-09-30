import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import LozengeCompiled from '../../compiled';
import LozengeEmotion from '../../index';

describe.each([
	['emotion', LozengeEmotion],
	['compiled', LozengeCompiled],
])('variant=%p', (_variant, Component) => {
	it('Default Lozenge should not fail basic aXe audit', async () => {
		const { container } = render(<Component>Default</Component>);

		await axe(container);
	});

	it('Bold Lozenge should not fail basic aXe audit', async () => {
		const { container } = render(<Component isBold>isBold</Component>);

		await axe(container);
	});
});
