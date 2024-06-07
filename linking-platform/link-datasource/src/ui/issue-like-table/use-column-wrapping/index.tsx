import { useCallback, useState } from 'react';

export const useColumnWrapping = (initialWrappedColumnKeys: string[] = []) => {
	const [wrappedColumnKeys, setWrappedColumnKeys] = useState<string[]>(initialWrappedColumnKeys);

	const onWrappedColumnChange = useCallback(
		(key: string, isWrapped: boolean) => {
			const set = new Set(wrappedColumnKeys);
			if (isWrapped) {
				set.add(key);
			} else {
				set.delete(key);
			}
			setWrappedColumnKeys(Array.from(set));
		},
		[wrappedColumnKeys],
	);

	return {
		wrappedColumnKeys,
		onWrappedColumnChange,
	};
};
