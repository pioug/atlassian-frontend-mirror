import React, { useCallback } from 'react';

import { render } from '@testing-library/react';

import Link from '../../../../index';

describe(`Ref forwarding:`, () => {
	it(`should return an HTMLAnchorElement as it's ref`, () => {
		const mock = jest.fn();
		function App() {
			const setRef = useCallback((ref: any) => {
				mock(ref);
			}, []);
			return (
				<Link ref={setRef} href="https://wwww.atlassian.com">
					Hello world
				</Link>
			);
		}

		render(<App />);

		expect(mock).toHaveBeenCalledTimes(1);
		expect(mock.mock.calls[0][0]).toBeInstanceOf(HTMLAnchorElement);
	});
});
