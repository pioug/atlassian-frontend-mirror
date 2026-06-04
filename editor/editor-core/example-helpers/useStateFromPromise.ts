import React from 'react';

// Copied and simplified from `editor-plugin-extension/src/ui/ConfigPanel/use-state-from-promise/index.ts`
export function useStateFromPromise<S>(
	callback: () => Promise<S>,
	deps: React.DependencyList,
	initialValue?: S,
): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>] {
	// AFP-2511 TODO: Fix automatic suppressions below
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fn = React.useCallback(callback, deps);
	const [value, setValue] = React.useState<S | undefined>(initialValue);

	React.useEffect(
		() => {
			Promise.resolve(fn()).then((result) => {
				setValue(result);
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[...deps],
	);

	return [value, setValue];
}
