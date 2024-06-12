import React, { useCallback } from 'react';

import { render } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component, elementType }) => {
	it(`${name}: should return a ${elementType.name} as it's ref`, () => {
		const mock = jest.fn();
		function App() {
			const setRef = useCallback((ref: any) => {
				mock(ref);
			}, []);
			return <Component ref={setRef}>Hey</Component>;
		}

		render(<App />);

		expect(mock).toHaveBeenCalledTimes(1);
		expect(mock.mock.calls[0][0]).toBeInstanceOf(elementType);
	});
});
