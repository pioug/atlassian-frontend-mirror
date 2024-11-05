import { isPreRelease2 } from './utils/advanced-layouts-flags';

export enum DIRECTION {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right',
}

export const maxLayoutColumnSupported = () => {
	return isPreRelease2() ? 5 : 3;
};
