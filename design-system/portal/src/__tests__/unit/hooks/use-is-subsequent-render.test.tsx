import React from 'react';

import { renderHook } from '@testing-library/react';

import useIsSubsequentRender from '../../../internal/hooks/use-is-subsequent-render';
import * as hooks from '../../../internal/hooks/use-isomorphic-layout-effect';
import { type MountStrategy } from '../../../internal/types';

describe('useIsSubsequentRender', () => {
	const effectSpy = jest.spyOn(React, 'useEffect');
	const layoutEffectSpy = jest.spyOn(hooks, 'useIsomorphicLayoutEffect');

	afterEach(() => {
		effectSpy.mockClear();
		layoutEffectSpy.mockClear();
	});

	it('should not mount with useLayoutEffect when mountStrategy change to layoutEffect', () => {
		const { result, rerender } = renderHook(
			({ mountStrategy }: { mountStrategy: MountStrategy }) => useIsSubsequentRender(mountStrategy),
			{
				initialProps: { mountStrategy: 'effect' },
			},
		);
		expect(result.current).toBe(true);
		expect(effectSpy).toHaveBeenCalled();
		expect(layoutEffectSpy).not.toHaveBeenCalled();

		rerender({
			mountStrategy: 'layoutEffect',
		});

		expect(layoutEffectSpy).not.toHaveBeenCalled();
	});

	it('should not mount with useEffect when mountStrategy change to effect', () => {
		const { result, rerender } = renderHook(
			({ mountStrategy }: { mountStrategy: MountStrategy }) => useIsSubsequentRender(mountStrategy),
			{
				initialProps: { mountStrategy: 'layoutEffect' },
			},
		);
		expect(result.current).toBe(true);
		expect(layoutEffectSpy).toHaveBeenCalled();
		expect(effectSpy).not.toHaveBeenCalled();

		rerender({
			mountStrategy: 'effect',
		});

		expect(effectSpy).not.toHaveBeenCalled();
	});
});
