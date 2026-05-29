export type CSSColor = `#${string}`;

/**
 * ThemeOptionsSchema: additional configuration options used to customize Atlassian's themes
 */
export interface ThemeOptionsSchema {
	brandColor: CSSColor;
}
