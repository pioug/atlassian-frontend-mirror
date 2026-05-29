const themeKinds = ['light', 'dark', 'spacing', 'typography', 'shape', 'motion'] as const;
type ThemeKind = (typeof themeKinds)[number];

export const isThemeKind = (themeKind: string): themeKind is ThemeKind => {
	return themeKinds.find((kind) => kind === themeKind) !== undefined;
};
