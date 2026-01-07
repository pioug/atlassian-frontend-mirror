import React, { type MutableRefObject, useCallback, useEffect } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { useTrackedRef } from '../../useTrackedRef';

const ComponentUsingHook = ({
	data,
	callback,
	callBackRefUpdate,
}: {
	callback: (data: MutableRefObject<string>) => void;
	callBackRefUpdate?: (ref: MutableRefObject<string>, snapshotData: string) => void;
	data: string;
}) => {
	const dataRef = useTrackedRef(data);

	useEffect(() => {
		if (callBackRefUpdate) {
			callBackRefUpdate(dataRef, dataRef.current);
		}
	}, [dataRef, callBackRefUpdate]);

	const onClick = useCallback(() => {
		callback(dataRef);
	}, [dataRef, callback]);

	return <button onClick={onClick}>Button</button>;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('useTrackedRef', () => {
	it('should return a reference that tracks the last value rendered', () => {
		const callback = jest.fn();

		const { rerender, getByText } = render(
			<ComponentUsingHook data="firstValue" callback={callback} />,
		);

		fireEvent.click(getByText('Button'));

		expect(callback).toBeCalled();

		const ref = callback.mock.calls[0][0];
		expect(ref.current).toBe('firstValue');

		callback.mockReset();

		rerender(<ComponentUsingHook data="secondValue" callback={callback} />);

		fireEvent.click(getByText('Button'));

		expect(callback).toBeCalledWith(ref);
		expect(ref.current).toBe('secondValue');
	});

	it('should useEffect not trigger again althouhg "data" prop is updated', () => {
		const callback = jest.fn();
		const callBackRefUpdate = jest.fn();

		const { rerender } = render(
			<ComponentUsingHook
				data="firstValue"
				callback={callback}
				callBackRefUpdate={callBackRefUpdate}
			/>,
		);

		// Update `data` -> `useTrackedRef` is passed with the new data -> but `useEffect` of a component is not triggered.
		// This is normal with `useRef` and `useEffect`.
		rerender(<ComponentUsingHook data="secondValue" callback={callback} />);

		expect(callBackRefUpdate).toHaveBeenCalledTimes(1);

		// callback of `useEffect` is called only one time when the component is mounted.
		const snapshoData = callBackRefUpdate.mock.calls[0][1];
		expect(snapshoData).toBe('firstValue');

		// `ref` object always points to the last value.
		const ref = callBackRefUpdate.mock.calls[0][0];
		expect(ref.current).toBe('secondValue');
	});
});
