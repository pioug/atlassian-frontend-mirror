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
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getAutoConverter(): Promise<ExtensionAutoConvertHandler[]>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getExtension(type: ExtensionType, key: ExtensionKey): Promise<ExtensionManifest<T> | undefined>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getExtensions(): Promise<ExtensionManifest<T>[]>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getPreloadedExtension?(type: ExtensionType, key: ExtensionKey): ExtensionManifest<T> | undefined;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	preload?(): Promise<void>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	search(keyword: string): Promise<ExtensionManifest<T>[]>;
}
