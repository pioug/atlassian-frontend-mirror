import { useContext } from 'react';

import { FlexibleCardContext } from './index';
import type { FlexibleCardContextType } from './index';

export const useFlexibleCardContext = (): FlexibleCardContextType | undefined =>
	useContext(FlexibleCardContext);
