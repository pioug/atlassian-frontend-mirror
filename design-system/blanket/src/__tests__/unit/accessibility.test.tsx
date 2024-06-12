/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';
import Lorem from 'react-lorem-component';

import { axe } from '@af/accessibility-testing';

import Blanket from '../../blanket';

it('Basic Blanket should not fail aXe audit', async () => {
	const { container } = render(<Blanket isTinted={true} shouldAllowClickThrough={true} />);
	await axe(container);
});

it('Basic Blanket with children should not fail aXe audit', async () => {
	const { container } = render(
		<Blanket isTinted={true} shouldAllowClickThrough={true}>
			<Lorem count={20} />
		</Blanket>,
	);
	await axe(container);
});
