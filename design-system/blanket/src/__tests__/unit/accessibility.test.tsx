/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Blanket from '../../blanket';

it('Basic Blanket should not fail aXe audit', async () => {
	const { container } = render(<Blanket isTinted={true} shouldAllowClickThrough={true} />);
	await axe(container);
});

it('Basic Blanket with children should not fail aXe audit', async () => {
	const { container } = render(
		<Blanket isTinted={true} shouldAllowClickThrough={true}>
			<div>Blanket content</div>
		</Blanket>,
	);
	await axe(container);
});
