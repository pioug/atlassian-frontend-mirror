import { GlobalFileReader } from './globalFileReader';

declare var global: any;

/**
 * The `jest.spyOn` handle on `global.FileReader`, installed once when this module is first
 * evaluated. `undefined` when there is no `FileReader` or when running outside jest.
 */
export const fileReaderSpy: any =
	GlobalFileReader && typeof jest !== 'undefined'
		? jest.spyOn(global, 'FileReader').mockImplementation(() => new GlobalFileReader())
		: undefined;
