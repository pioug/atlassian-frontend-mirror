import { type InternalFlexibleUiOptions } from '../../view/FlexibleCard/types';
import { useFlexibleCardContext } from './useFlexibleCardContext';

export const useFlexibleUiOptionContext = (): InternalFlexibleUiOptions | undefined =>
	useFlexibleCardContext()?.ui;
