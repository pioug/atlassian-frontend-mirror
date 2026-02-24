import {
	type ExtensionAutoConvertHandler,
	type ExtensionKey,
	type ExtensionManifest,
	type ExtensionType,
} from './extension-manifest';
import { type Parameters } from './extension-parameters';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExtensionProvider<T extends Parameters = any> {
	getAutoConverter: () => Promise<ExtensionAutoConvertHandler[]>;
	getExtension: (
		type: ExtensionType,
		key: ExtensionKey,
	) => Promise<ExtensionManifest<T> | undefined>;
	getExtensions: () => Promise<ExtensionManifest<T>[]>;
	getPreloadedExtension?: (
		type: ExtensionType,
		key: ExtensionKey,
	) => ExtensionManifest<T> | undefined;
	preload?: () => Promise<void>;
	search: (keyword: string) => Promise<ExtensionManifest<T>[]>;
}
