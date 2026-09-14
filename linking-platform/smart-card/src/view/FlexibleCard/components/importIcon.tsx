import Loadable from 'react-loadable';

export const importIcon = (importFn: () => Promise<any>): any => {
	return Loadable({
		loader: () => importFn().then((module) => module.default),
		loading: () => null,
	}) as any; // Because we're using dynamic loading here, TS will not be able to infer the type.
};
