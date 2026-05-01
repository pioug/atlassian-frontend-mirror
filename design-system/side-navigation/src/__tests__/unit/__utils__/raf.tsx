export const step = (): void => {
	(window.requestAnimationFrame as any).step();
};
