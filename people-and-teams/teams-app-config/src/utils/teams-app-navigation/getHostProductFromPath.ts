import { hostname } from '../../common/utils/hostname';
import { pathname } from '../../common/utils/pathname';

export function getHostProductFromPath(): 'home' | 'confluence' | 'jira' | undefined {
	const path = pathname();
	if (path.startsWith('/wiki')) {
		return 'confluence';
	}
	if (path.startsWith('/jira')) {
		return 'jira';
	}
	if (hostname().startsWith('home')) {
		return 'home';
	}
	return undefined;
}
