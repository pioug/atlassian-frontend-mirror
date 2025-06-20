import { renderHook } from '@testing-library/react-hooks';

import { useTextDirection } from '../../panel-splitter/use-text-direction';

describe('useTextDirection', () => {
	it('should return ltr if the direction is not defined', () => {
		const element = document.createElement('div');

		const { result } = renderHook(useTextDirection, {
			initialProps: element,
		});

		expect(result.current).toEqual('ltr');
	});

	it('should return ltr if the direction is ltr', () => {
		const element = document.createElement('div');

		element.style.direction = 'ltr';
		const { result } = renderHook(useTextDirection, {
			initialProps: element,
		});

		expect(result.current).toEqual('ltr');
	});

	it('should return rtl if the direction is rtl', () => {
		const element = document.createElement('div');

		element.style.direction = 'rtl';
		const { result } = renderHook(useTextDirection, {
			initialProps: element,
		});

		expect(result.current).toEqual('rtl');
	});
});
