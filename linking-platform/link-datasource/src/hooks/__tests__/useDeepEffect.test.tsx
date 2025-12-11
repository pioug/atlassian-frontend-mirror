import React, { useRef } from 'react';

import { render } from '@testing-library/react';

import { useDeepEffect } from '../useDeepEffect';

describe('useDeepEffect', () => {
	const callbackMock = jest.fn();

	const TestComponent = ({ obj }: { obj?: { a?: string; b?: string } }) => {
		useDeepEffect(() => {
			callbackMock();
		}, [callbackMock, obj]);
		return null;
	};

	beforeEach(() => {
		callbackMock.mockClear();
	});

	it('should trigger callback on initial render', async () => {
		render(<TestComponent obj={{ a: 'a', b: 'b' }} />);
		expect(callbackMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should trigger callback when dependencies change values', async () => {
		const obj1 = { a: 'a', b: 'b' };
		const obj2 = { a: 'a', b: 'z' };

		const { rerender } = render(<TestComponent obj={obj1} />);
		callbackMock.mockClear();

		rerender(<TestComponent obj={obj2} />);
		expect(callbackMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should not trigger callback when dependencies is the same object', async () => {
		const obj1 = { a: 'a', b: 'b' };

		const { rerender } = render(<TestComponent obj={obj1} />);
		callbackMock.mockClear();

		rerender(<TestComponent obj={obj1} />);
		expect(callbackMock).not.toHaveBeenCalled();

		await expect(document.body).toBeAccessible();
	});

	it('should not trigger callback when dependencies is the different object with the same value', async () => {
		const obj1 = { a: 'a', b: 'b' };
		const obj2 = { a: 'a', b: 'b' };
		const obj3 = { a: 'a', b: 'b' };

		const { rerender } = render(<TestComponent obj={obj1} />);
		callbackMock.mockClear();

		rerender(<TestComponent obj={obj2} />);
		rerender(<TestComponent obj={obj3} />);

		expect(callbackMock).not.toHaveBeenCalled();

		await expect(document.body).toBeAccessible();
	});

	it('should trigger callback when dependencies become undefined', async () => {
		const obj1 = { a: 'a', b: 'b' };

		const { rerender } = render(<TestComponent obj={obj1} />);
		callbackMock.mockClear();

		rerender(<TestComponent obj={undefined} />);

		expect(callbackMock).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	describe('with ref preventing first render, mimicking datasource table', () => {
		const DatasourceTableMock = ({ obj }: { obj?: { a?: string; b?: string } }) => {
			const isInitialRender = useRef(true);

			useDeepEffect(() => {
				if (!isInitialRender.current) {
					callbackMock();
				}
				isInitialRender.current = false;
			}, [callbackMock, obj]);
			return null;
		};

		it('should not trigger callback on initial render', async () => {
			render(<DatasourceTableMock obj={{ a: 'a', b: 'b' }} />);

			expect(callbackMock).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should trigger callback when dependencies change values', async () => {
			const obj1 = { a: 'a', b: 'b' };
			const obj2 = { a: 'a', b: 'z' };

			const { rerender } = render(<DatasourceTableMock obj={obj1} />);
			rerender(<DatasourceTableMock obj={obj2} />);

			expect(callbackMock).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should trigger callback every time dependencies change values', async () => {
			const obj1 = { a: 'a', b: 'b' };
			const obj2 = { a: 'a', b: 'x' };
			const obj3 = { a: 'a', b: 'y' };
			const obj4 = { a: 'a', b: 'z' };

			const { rerender } = render(<DatasourceTableMock obj={obj1} />);
			rerender(<DatasourceTableMock obj={obj2} />);
			rerender(<DatasourceTableMock obj={obj3} />);
			rerender(<DatasourceTableMock obj={obj4} />);

			expect(callbackMock).toHaveBeenCalledTimes(3);

			await expect(document.body).toBeAccessible();
		});

		it('should trigger callback when dependencies become undefined', async () => {
			const obj1 = { a: 'a', b: 'b' };
			const { rerender } = render(<DatasourceTableMock obj={obj1} />);
			rerender(<DatasourceTableMock obj={undefined} />);

			expect(callbackMock).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		it('should not trigger callback when dependencies is the same object', async () => {
			const obj1 = { a: 'a', b: 'b' };

			const { rerender } = render(<DatasourceTableMock obj={obj1} />);
			rerender(<DatasourceTableMock obj={obj1} />);

			expect(callbackMock).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});

		it('should not trigger callback when dependencies is the different object with the same value', async () => {
			const obj1 = { a: 'a', b: 'b' };
			const obj2 = { a: 'a', b: 'b' };
			const obj3 = { a: 'a', b: 'b' };

			const { rerender } = render(<DatasourceTableMock obj={obj1} />);
			rerender(<DatasourceTableMock obj={obj2} />);
			rerender(<DatasourceTableMock obj={obj3} />);

			expect(callbackMock).not.toHaveBeenCalled();

			await expect(document.body).toBeAccessible();
		});
	});
});
