import { type Ref, useContext } from 'react';

import { useUniqueId } from '../utils/use-unique-id';
import { StaggeredEntranceContext } from './staggered-entrance';

export const useStaggeredEntrance = (): {
	isReady: boolean;
	delay: number;
	ref: Ref<any>;
} => {
	const identifier = useUniqueId();
	const context = useContext(StaggeredEntranceContext);
	return context(identifier);
};
