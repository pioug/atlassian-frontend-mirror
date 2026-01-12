import { act, renderHook } from '@testing-library/react';

import useSelectable from '../use-selectable';

describe('useSelectable', () => {
	it('should have correct initial state', () => {
		const { result } = renderHook(() => useSelectable());

		const [state] = result.current;

		expect(state.anyChecked).toBe(false);
		expect(state.allChecked).toBe(false);
		expect(state.checked).toHaveLength(0);
	});

	it('should correctly update individual selection', () => {
		const { result } = renderHook(() => useSelectable());

		act(() => {
			const [, { toggleSelection }] = result.current;
			toggleSelection(0, false);
		});

		const [state] = result.current;

		expect(state.anyChecked).toBe(true);
		expect(state.allChecked).toBe(false);
		expect(state.checked[0]).toBe(0);
	});

	it('root select all works', () => {
		const { result } = renderHook(() => useSelectable());

		act(() => {
			const [, { setAll, setMax }] = result.current;
			setMax(10);
			setAll();
		});

		const [state] = result.current;

		expect(state.anyChecked).toBe(true);
		expect(state.allChecked).toBe(true);
		expect(state.checked[0]).toBe(0);
	});

	it('root unselect all works', () => {
		const { result } = renderHook(() => useSelectable());

		act(() => {
			const [, { setAll, setMax }] = result.current;
			setMax(10);
			setAll();
		});

		const [state1] = result.current;

		expect(state1.anyChecked).toBe(true);
		expect(state1.allChecked).toBe(true);
		expect(state1.checked[0]).toBe(0);

		act(() => {
			const [, { removeAll }] = result.current;
			removeAll();
		});

		const [state2] = result.current;

		expect(state2.anyChecked).toBe(false);
		expect(state2.allChecked).toBe(false);
		expect(state2.checked[0]).toBe(undefined);
	});

	it('root select -> single toggle off', () => {
		const { result } = renderHook(() => useSelectable());

		act(() => {
			const [, { setAll, setMax }] = result.current;
			setMax(10);
			setAll();
		});

		const [state1] = result.current;

		expect(state1.anyChecked).toBe(true);
		expect(state1.allChecked).toBe(true);
		expect(state1.checked[0]).toBe(0);

		act(() => {
			const [, { toggleSelection }] = result.current;
			toggleSelection(0, false);
		});

		const [state2] = result.current;

		expect(state2.anyChecked).toBe(true);
		expect(state2.allChecked).toBe(false);
		expect(state2.checked[0]).toBe(1);
	});
});
