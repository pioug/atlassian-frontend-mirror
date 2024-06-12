import React from 'react';

import { render } from '@testing-library/react';

import { defaultButtonVariants } from '../../../utils/variants';

defaultButtonVariants.forEach(({ name, Component }) => {
	it(`${name}: should only render once on initial render`, () => {
		const mock = jest.fn();
		function App() {
			mock();
			return null;
		}

		render(
			<Component aria-label="Save">
				<App />
			</Component>,
		);

		expect(mock).toHaveBeenCalledTimes(1);
	});
});
