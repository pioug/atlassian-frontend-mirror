import { useEffect, useState } from 'react';

import { type MountStrategy } from '../types';

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

const useIsSubsequentRender = (mountStrategy?: MountStrategy): boolean => {
	const [isSubsequentRender, setIsSubsequentRender] = useState(false);

	const [useMountEffect] = useState(() =>
		mountStrategy === 'layoutEffect' ? useIsomorphicLayoutEffect : useEffect,
	);

	useMountEffect(() => {
		setIsSubsequentRender(true);
	}, []);

	return isSubsequentRender;
};
export default useIsSubsequentRender;
