import { type MutableRefObject, useEffect } from 'react';

const useChildIdsEffect: (childIds: MutableRefObject<Set<string>>, id: string) => void = (
	childIds: MutableRefObject<Set<string>>,
	id: string,
): void => {
	useEffect(() => {
		if (!childIds || !childIds.current) {
			return;
		}

		if (!childIds.current.has(id)) {
			childIds.current.add(id);
		}

		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			childIds.current.delete(id);
		};
		// childIds shouldn't change as it's a ref
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);
};

export default useChildIdsEffect;
