export function getScaleFactorFromFile(file: File): number | null {
	try {
		// filenames with scale ratio in name take precedence - eg. filename@2x.png
		const match = file.name.trim().match(/@([0-9\.]+)x\.[a-z]{3}$/);
		if (match) {
			return parseFloat(match[1]);
		}
	} catch (e) {
		// parse problem, return null
	}
	return null;
}
