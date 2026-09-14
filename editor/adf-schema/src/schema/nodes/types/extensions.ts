export type Layout = 'default' | 'wide' | 'full-width';

export interface ExtensionAttributes {
	/**
	 * @minLength 1
	 */
	extensionKey: string;
	/**
	 * @minLength 1
	 */
	extensionType: string;
	layout?: Layout;
	/**
	 * @minLength 1
	 */
	localId?: string;
	parameters?: object;
	text?: string;
}

export interface InlineExtensionAttributes {
	/**
	 * @minLength 1
	 */
	extensionKey: string;
	/**
	 * @minLength 1
	 */
	extensionType: string;
	/**
	 * @minLength 1
	 */
	localId?: string;
	parameters?: object;
	text?: string;
}

// Public API aliases preserved from an eliminated entry-point (volt-migrate-package).
export { type Layout as ExtensionLayout };
