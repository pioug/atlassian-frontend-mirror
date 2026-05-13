import { replaceRaf } from 'raf-stub';

export const replace = (): void => {
	replaceRaf();
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const step = (): void => {
	(window.requestAnimationFrame as any).step();
};
