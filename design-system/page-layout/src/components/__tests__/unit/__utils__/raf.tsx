import { replaceRaf } from 'raf-stub';

export const replace = (): void => {
	replaceRaf();
};

export const step = (): void => {
	(window.requestAnimationFrame as any).step();
};

export const flush = (): void => {
	(window.requestAnimationFrame as any).flush();
};
