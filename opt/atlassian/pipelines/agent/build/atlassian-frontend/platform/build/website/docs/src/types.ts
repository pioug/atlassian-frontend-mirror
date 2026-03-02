/**
 * Used for Atlaskit website docs generator for defining a docs tab.
 */
export type DocsTab = {
	/**
	 * The content of the tab.
	 */
	content: React.ReactNode;
	/**
	 * The name of the tab.
	 */
	name: string;
};

/**
 * Used by the website generator to define tabs for a docs page and the order of the tabs.
 */
export type DocsTabs = Array<DocsTab>;
