import React from 'react';

import { render } from '@testing-library/react';

import forEachType from './_util/for-each-type';

forEachType(({ name, Component }) => {
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

		expect(mock).toHaveBeenCalledTimes(process.env.IS_REACT_18_STRICT_MODE ? 2 : 1);
	});
});
