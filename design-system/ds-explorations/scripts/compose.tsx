export const compose: (...fns: ((...any: any[]) => any)[]) => (x: any) => any =
	(...fns: ((...any: any[]) => any)[]) =>
	(x: any): any =>
		fns.reduce((res, fn) => fn(res), x);
