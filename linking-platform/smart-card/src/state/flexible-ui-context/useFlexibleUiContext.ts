import { type FlexibleUiDataContext } from './types';
import { useFlexibleCardContext } from './useFlexibleCardContext';

export const useFlexibleUiContext = (): FlexibleUiDataContext | undefined =>
	useFlexibleCardContext()?.data;
