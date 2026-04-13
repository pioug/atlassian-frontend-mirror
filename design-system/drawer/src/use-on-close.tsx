import { type SyntheticEvent, useContext } from 'react';

import { OnCloseContext } from './on-close-context';

export const useOnClose = ():
	| ((event: SyntheticEvent<HTMLElement>, analyticsEvent?: any) => void)
	| undefined => useContext(OnCloseContext);
