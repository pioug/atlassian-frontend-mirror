import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';

export const useDeepEffect = (callback: EffectCallback, dependencies?: DependencyList) => {
	const prevDependencies = useRef<DependencyList>();

	useEffect(() => {
		if (!isEqual(dependencies, prevDependencies.current)) {
			callback();
			prevDependencies.current = dependencies;
		}
	}, [dependencies, callback]);
};
