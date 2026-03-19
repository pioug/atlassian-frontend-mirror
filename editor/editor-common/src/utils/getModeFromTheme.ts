// Resolves the provided mode into either 'dark' or 'light'.
export function getModeFromTheme(theme: string): "dark" | "light" {
	return theme === 'dark' ? 'dark' : 'light';
}
