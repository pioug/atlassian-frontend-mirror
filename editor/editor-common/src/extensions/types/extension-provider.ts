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
	getExtensions(): Promise<ExtensionManifest<T>[]>;
	getExtension(type: ExtensionType, key: ExtensionKey): Promise<ExtensionManifest<T> | undefined>;
	search(keyword: string): Promise<ExtensionManifest<T>[]>;
	getAutoConverter(): Promise<ExtensionAutoConvertHandler[]>;
}
