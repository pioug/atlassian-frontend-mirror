import { type NavigationSource } from '../../../navigation';
import type { NavigatedInput } from './navigated';

export const inputFromSource = (source: NavigationSource): NavigatedInput => {
	return {
		mouse: 'button',
		keyboard: 'keys',
	}[source] as NavigatedInput;
};
